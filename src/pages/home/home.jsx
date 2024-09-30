import { Tabs } from "antd";

import "./home.scss";

// Components
import { MoodPlaylistGenerator } from "../../components/mood-playlist-generator/mood-playlist-generator";
import { SongMatchGenerator } from "../../components/song-match-generator/song-match-generator";
import { ArtistMatchGenerator } from "../../components/artist-match-generator/artist-match-generator";

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
      component: <SongMatchGenerator />,
    },
    {
      label: "Artist Match",
      value: "artist-match",
      component: <ArtistMatchGenerator />,
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
