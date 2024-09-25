import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { generatePlaylist } from "../../apis/playlist-generator";
import {
  LinkOutlined,
  PlayCircleFilled,
  SpotifyFilled,
} from "@ant-design/icons";
import { savePlaylist } from "../../apis/save-playlist";
import { useAuth } from "../../hooks/useAuth";

import "./mood-playlist-generator.scss";

const { Title } = Typography;

export const MoodPlaylistGenerator = () => {
  const options = [
    {
      label: "Gym",
      value: "gym",
    },
    {
      label: "Party",
      value: "party",
    },
    {
      label: "Relax",
      value: "relax",
    },
    {
      label: "Travel",
      value: "travel",
    },
    {
      label: "Romantic",
      value: "romantic",
    },
  ];
  const [selectOption, setSelectedOption] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  const [spotifyTracks, setSpotifyTracks] = useState([]);

  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState();

  const [playlistName, setPlaylistName] = useState("");

  const onGenerate = async () => {
    try {
      setSpotifyTracks([]);
      setIsFetching(true);
      const data = await generatePlaylist(selectOption);
      setSpotifyTracks(data.tracks);
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsFetching(false);
    }
  };

  const openLink = (link) => {
    window.open(link, "_blank");
  };

  const onSave = () => {
    setIsModalOpen(true);
  };

  const onSavePlaylist = async () => {
    try {
      setIsModalOpen(false);
      setIsFetching(true);
      const ids = spotifyTracks.map((track) => track.uri);
      const payload = {
        ids,
        userId: user.id,
        playlist: {
          name: playlistName,
          description: `Playlist-table saved playlist for ${selectOption} mood on time ${new Date().toUTCString()}`,
        },
      };
      await savePlaylist(payload);
      setPlaylistName("");
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Row justify={"center"}>
      <Col xxl={20} xl={20} lg={20} md={20} sm={22} xs={22}>
        <Row align={"middle"} justify={"center"}>
          <Col span={24}>
            <Title style={{ textAlign: "center" }}>
              Mood Playlist Generator
            </Title>
          </Col>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Select
              onChange={(value) => setSelectedOption(value)}
              style={{ width: "100%" }}
              size="large"
              showSearch
              placeholder="Select the mood/occasion"
              disabled={isFetching}
              loading={isFetching}
            >
              {options.map((option) => (
                <Select.Option value={option.value} key={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row justify={"center"}>
          <Col xxl={4} xl={4} lg={4} md={8} sm={24} xs={24}>
            <Button
              style={{ marginTop: 16, width: "100%" }}
              size="large"
              color="primary full-width"
              disabled={!selectOption}
              loading={isFetching}
              onClick={onGenerate}
            >
              {isFetching ? "Generating..." : "Generate"}
            </Button>
          </Col>
        </Row>

        {!!spotifyTracks.length && (
          <Row justify={"end"} style={{ margin: "12px 0px" }}>
            <Col xxl={5} xl={5} lg={6} md={8} sm={24} xs={24}>
              <Button
                size="large"
                type="primary"
                icon={<SpotifyFilled />}
                style={{ width: "100%" }}
                onClick={onSave}
                loading={isFetching}
              >
                Save Playlist to Spotify
              </Button>
            </Col>
          </Row>
        )}

        <Row gutter={[20, 20]} className="list">
          {spotifyTracks.map((track) => {
            const actions = [];
            if (track?.preview_url) {
              actions.push(
                <PlayCircleFilled
                  key="play"
                  style={{ fontSize: "1.2rem" }}
                  onClick={() => openLink(track.preview_url)}
                />
              );
            }
            if (track?.external_urls?.spotify) {
              actions.push(
                <LinkOutlined
                  key="link"
                  style={{ fontSize: "1.2rem" }}
                  onClick={() => openLink(track.external_urls.spotify)}
                />
              );
            }
            return (
              <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24} key={track.uri}>
                <Card
                  cover={
                    <Image
                      src={track.album.images[0].url}
                      preview={false}
                      className="album-image"
                    />
                  }
                  actions={actions}
                >
                  <Row>
                    <Col span={24}>
                      <b>Album: </b>
                      {track.album.name}
                    </Col>
                    <Col span={24}>
                      <b>Artist/s: </b>
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </Col>
                    <Col span={24}>
                      <b>Track: </b>
                      {track.name}
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Col>

      <Modal
        title="Please enter Playlist name"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            color="default"
            onClick={() => setIsModalOpen(false)}
            key={"cancel"}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            color="primary"
            onClick={onSavePlaylist}
            key={"save"}
            disabled={!playlistName || playlistName?.length < 3}
          >
            Save
          </Button>,
        ]}
      >
        <Input
          value={playlistName}
          onChange={({ target }) => setPlaylistName(target.value)}
          size="large"
        />
      </Modal>
    </Row>
  );
};
