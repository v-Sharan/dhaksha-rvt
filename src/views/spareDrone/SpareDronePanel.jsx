import React, { useRef, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import './index.css';
import messageHub from '~/message-hub';
import store from '~/store';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';
import { Button } from '@material-ui/core';
import LongPressButton from '~/components/button/LongPressButton';

const { dispatch } = store;

const video = [
  {
    id: 1,
    name: 'Camera 1',
    url: 'http://172.20.67.44:8000/video1',
    ip: '192.168.6.121',
  },
  {
    id: 2,
    name: 'Camera 2',
    url: 'http://172.20.67.44:8000/video2',
    ip: '192.168.6.122',
  },
  {
    id: 3,
    name: 'Camera 3',
    url: 'http://172.20.67.44:8000/video3',
    ip: '192.168.6.123',
  },
  {
    id: 4,
    name: 'Camera 4',
    url: 'http://172.20.67.44:8000/video4',
    ip: '192.168.6.124',
  },
  {
    id: 5,
    name: 'Camera 5',
    url: 'http://172.20.67.44:8000/video5',
    ip: '192.168.6.125',
  },  {
    id: 6,
    name: 'Camera 6',
    url: 'http://172.20.67.44:8000/video6',
    ip: '192.168.6.126',
  },
  {
    id: 7,
    name: 'Camera 7',
    url: 'http://172.20.67.44:8000/video7',
    ip: '192.168.6.127',
  },
  {
    id: 8,
    name: 'Camera 8',
    url: 'http://172.20.67.44:8000/video8',
    ip: '192.168.6.128',
  },
  {
    id: 9,
    name: 'Camera 9',
    url: 'http://172.20.67.44:8000/video9',
    ip: '192.168.6.129',
  },
  {
    id: 10,
    name: 'Camera 10',
    url: 'http://172.20.67.44:8000/video10',
    ip: '192.168.6.130',
  },
];

const SpareDronePanel = () => {
  const [camId, setCamId] = useState(video[0].id);
  const [camUrl, setCamUrl] = useState(video[0].url);
  const [allCamera, setAllCamera] = useState(false);
  const [allCamUrl, setAllCamUrl] = useState([]);
  const [gimbal, setGimbal] = useState(video[0].ip);
  const [tracking, setTracking] = useState(false);

  const onCameraChange = async (id, url, ip) => {

    setAllCamera(false);
    setCamId(id);
    setCamUrl(url);
    setGimbal(ip);
  };

  const onButtonPress = async (msg) => {
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        message: msg,
        ip: gimbal,
      });

      if (!Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `${msg} Message Failed`,
            semantics: MessageSemantics.ERROR,
          })
        );
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `${e} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  const sourceRadioButtons = video.map((source) => (
    <FormControlLabel
      key={source.name}
      value={source.url}
      label={source.name}
      style={{ marginTop: 5 }}
      control={<Radio checked={camId === source.id} />}
      onChange={onCameraChange.bind(this, source.id, source.url, source.ip)}
    />
  ));

  const handleDoubleClick = async (event) => {
    if (tracking) {
      dispatch(
        showNotification({
          message: `Tracking is already enabled`,
          semantics: MessageSemantics.ERROR,
        })
      );
      return;
    }
    const rect = event.target.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        x: parseInt(x),
        y: parseInt(y),
        ip: gimbal,
        message: 'track',
      });

      if (!Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `Tracking Message Failed`,
            semantics: MessageSemantics.ERROR,
          })
        );
      } else {
        setTracking(true);
        dispatch(
          showNotification({
            message: `Tracking Started`,
            semantics: MessageSemantics.SUCCESS,
          })
        );
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `${e} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  return (
    <div>
      {allCamera ? (
        camId == 3 &&
        allCamUrl?.length != 0 && (
          <div className='allcamera'>
            {allCamUrl?.map(({ url, ip }) => (
              <img
                style={{
                  // position: 'absolute',
                  width: '50%',
                  height: '50%',
                  cursor: 'pointer',
                }}
                onDoubleClick={handleDoubleClick}
                onClick={() => {
                  dispatch(
                    showNotification({
                      message: `Gimabal ip set to ${ip}`,
                      semantics: MessageSemantics.SUCCESS,
                    })
                  );
                  setGimbal(ip);
                }}
                src={url}
                // src={'https://placebear.com/g/200/200'}
              />
            ))}
          </div>
        )
      ) : (
        <img
          style={{
            width: '1280px',
            height: '720px',
          }}
          onDoubleClick={handleDoubleClick}
          src={camUrl}
        />
      )}
      <RadioGroup key='cameraPanel' name='source.camera'>
        {sourceRadioButtons}
      </RadioGroup>
      <h1>Gimbal Control</h1>
      <LongPressButton
        onLongPress={onButtonPress.bind(this, 'zoom_in')}
        onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
        // onClick={onButtonPress.bind(this, 'zoom_in')}
      >
        Zoom in
      </LongPressButton>
      <LongPressButton
        onLongPress={onButtonPress.bind(this, 'zoom_out')}
        onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
      >
        Zoom out
      </LongPressButton>
      <Button
        disabled={!tracking}
        onClick={() => {
          setTracking(false);
        }}
      >
        Stop Recording
      </Button>
      <div className='data'>
        <div class='gamepad'>
          <div class='row'>
            <div className='button'></div>
            <LongPressButton
              onLongPress={onButtonPress.bind(this, 'up')}
              onLongPressEnd={onButtonPress.bind(this, 'stop')}
            >
              Up
            </LongPressButton>
            <div className='button'></div>
          </div>
          <div class='row'>
            <LongPressButton
              onLongPress={onButtonPress.bind(this, 'left')}
              onLongPressEnd={onButtonPress.bind(this, 'stop')}
            >
              Left
            </LongPressButton>
            <Button onClick={onButtonPress.bind(this, 'home')}>HOME</Button>
            <LongPressButton
              onLongPress={onButtonPress.bind(this, 'right')}
              onLongPressEnd={onButtonPress.bind(this, 'stop')}
            >
              RIGHT
            </LongPressButton>
          </div>
          <div class='row'>
            <div className='button'></div>
            <LongPressButton
              onLongPress={onButtonPress.bind(this, 'down')}
              onLongPressEnd={onButtonPress.bind(this, 'stop')}
            >
              Down
            </LongPressButton>
            <div className='button'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpareDronePanel;
