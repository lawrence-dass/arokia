import TrackPlayer, { Event } from 'react-native-track-player';

// CommonJS export required — RNTP registerPlaybackService uses require() to load this module.
// Do NOT use ES6 `export default`. Do NOT call React hooks here — headless task runs outside the React tree.
module.exports = async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));

  // NFR-R2: phone call interruption — pause on call start, resume when call ends
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused, permanent }) => {
    if (permanent) {
      await TrackPlayer.stop();
    } else if (paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
};
