import { Tabs } from "antd";

import "./home.scss";

// Components
import { MoodPlaylistGenerator } from "../../components/mood-playlist-generator/mood-playlist-generator";

export const Home = () => {
  const tabModes = [
    {
      label: "Mood Generator",
      value: "mood-generator",
      component: <MoodPlaylistGenerator />,
    },
    {
      label: "Song Match",
      value: "song-match",
    },
    {
      label: "Artist Match",
      value: "artist-match",
    },
  ];

  return (
    <Tabs
      type="card"
      items={tabModes.map((mode) => {
        return {
          label: mode.label,
          key: mode.value,
          children: mode.component,
        };
      })}
      size="large"
    />
  );
};
