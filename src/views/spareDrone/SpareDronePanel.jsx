import React, {  useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './index.css';
import messageHub from '~/message-hub';
import store from '~/store';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import LongPressButton from '~/components/button/LongPressButton';

const { dispatch } = store;

const video = [
  {
    id: 1,
    name: 'Camera 1',
    url: 'http://172.29.181.42:8000/video1',
    ip: '192.168.6.121',
  },
  {
    id: 2,
    name: 'Camera 2',
    url: 'http://172.29.181.42:8000/video2',
    ip: '192.168.6.122',
  },
  {
    id: 3,
    name: 'Camera 3',
    url: 'http://172.29.181.42:8000/video3',
    ip: '192.168.6.123',
  },
  {
    id: 4,
    name: 'Camera 4',
    url: 'http://172.29.181.42:8000/video4',
    ip: '192.168.6.124',
  },
  {
    id: 5,
    name: 'Camera 5',
    url: 'http://172.29.181.42:8000/video5',
    ip: '192.168.6.125',
  },  {
    id: 6,
    name: 'Camera 6',
    url: 'http://172.29.181.42:8000/video6',
    ip: '192.168.6.126',
  },
  {
    id: 7,
    name: 'Camera 7',
    url: 'http://172.29.181.42:8000/video7', 
    ip: '192.168.6.127',
  },
  {
    id: 8,
    name: 'Camera 8',
    url: 'http://172.29.181.42:8000/video8',
    ip: '192.168.6.128',
  },
  {
    id: 9,
    name: 'Camera 9',
    url: 'http://172.29.181.42:8000/video9', 
    ip: '192.168.6.129',
  },
  {
    id: 10,
    name: 'Camera 10',
    url: 'http://172.29.181.42:8000/video10',
    ip: '192.168.6.130',
  },
];

function getUrlbyIp(ip){
  const foundObject = video.find(item => item.ip === ip)
  return foundObject ? foundObject : {}
}

const SpareDronePanel = () => {
  const [camUrl, setCamUrl] = useState(video[0].url);
  const [allCamera, setAllCamera] = useState(false);
  const [allCamUrl, setAllCamUrl] = useState([]);
  const [gimbal, setGimbal] = useState(video[0].ip);
  const [gimbalControl, setGimbalControl] = useState(video[0].ip);
  const [tracking, setTracking] = useState(false);
  const [record, setRecording] = useState(false);

  const onCameraChange = async ({ target }) => {
    const { id, url } = getUrlbyIp(target.value);
    if (id === 11) {
      setAllCamera(true);
      setAllCamUrl([
        'http://172.29.181.42:8000/video1',
        'http://172.29.181.42:8000/video2',
        'http://172.29.181.42:8000/video3',
        'http://172.29.181.42:8000/video4',
        'http://172.29.181.42:8000/video5',
        'http://172.29.181.42:8000/video6',
        'http://172.29.181.42:8000/video7',
        'http://172.29.181.42:8000/video8',
        'http://172.29.181.42:8000/video9',
        'http://172.29.181.42:8000/video10',
      ]);
      setGimbal(target.value);
      if (target.value === 'All Camera') {
        setGimbalControl('192.168.6.121');
        return;
      }
      setGimbalControl(target.value);
    }
    setAllCamera(false);
    setCamUrl(url);
    setGimbalControl(target.value);
    setGimbal(target.value);
  };

  const onButtonPress = async (msg) => {
    // if (allCamera) return;
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        message: msg,
        ip: gimbalControl,
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

  const handleDoubleClick = async (event) => {
    if (tracking) {
      dispatch(
        showNotification({
          message: `Tracking is already enabled`,
          semantics: MessageSemantics.INFO,
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

  const imageStyle = {
    width: '250px',
    height: '250px',
    objectFit: 'cover',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '5px',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    justifyContent: 'center',
    padding: '15px',
  };

  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          alignSelf: 'center',
          gap: 10,
        }}
      >
        <FormControl>
          <InputLabel id='demo-simple-select-label'>Ip</InputLabel>
          <Select
            id='demo-simple-select-label'
            onChange={onCameraChange}
            value={gimbal}
          >
            {video.map(({ id, ip, name, url }) => (
              <MenuItem value={ip} name={url}>
                {ip}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'zoom_in')}
          onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
        >
          Zoom in
        </LongPressButton>
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'zoom_out')}
          onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
        >
          Zoom out
        </LongPressButton>
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'up')}
          onLongPressEnd={onButtonPress.bind(this, 'stop')}
        >
          Up
        </LongPressButton>
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
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'down')}
          onLongPressEnd={onButtonPress.bind(this, 'stop')}
        >
          Down
        </LongPressButton>
        <Button
          onClick={() => {
            onButtonPress('start_record');
            setRecording(true);
          }}
        >
          Start Recording
        </Button>
        <Button
          onClick={() => {
            onButtonPress('stop_record');
            setRecording(false);
          }}
        >
          Stop Recording
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={gridStyle}>
          {allCamera ? (
            allCamUrl.length != 0 &&
            allCamUrl.map((url, i) => (
              <img
                id={i}
                style={imageStyle}
                src={url}
                onClick={() => {
                  dispatch(
                    showNotification({
                      message: `192.168.6.${120 + i + 1}`,
                    })
                  );
                  setGimbalControl(`192.168.6.${120 + i + 1}`);
                }}
              />
            ))
          ) : (
            <img
              style={{
                width: '1180px',
                height: '620px',
              }}
              onDoubleClick={handleDoubleClick}
              src={camUrl}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default SpareDronePanel;
