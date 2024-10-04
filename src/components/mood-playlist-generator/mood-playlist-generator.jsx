import { useState } from "react";
import {
  AutoComplete,
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
  LoadingOutlined,
  PlayCircleFilled,
  SpotifyFilled,
} from "@ant-design/icons";
import { savePlaylist } from "../../apis/save-playlist";
import { useAuth } from "../../hooks/useAuth";

import "./mood-playlist-generator.scss";
import { useNotification } from "../../hooks/notification";

const { Title } = Typography;

export const MoodPlaylistGenerator = () => {
  const { api } = useNotification();

  const options = [
    {
      label: "Groovy night out with friends",
      value: "groovy night out with friends",
    },
    {
      label: "Gym",
      value: "Gym",
    },
    {
      label: "Party",
      value: "Party",
    },
    {
      label: "Relax",
      value: "Relax",
    },
    {
      label: "Travel",
      value: "Travel",
    },
    {
      label: "Romantic",
      value: "Romantic",
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
      const data = await generatePlaylist({ mood: selectOption });
      setSpotifyTracks(data.tracks.items);
    } catch (err) {
      api.error({
        message: err.message,
        placement: "top",
      });
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

  const onSelectOption = (option) => {
    setSelectedOption(option);
    setSpotifyTracks([]);
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
      api.success({
        message: `Playlist ${playlistName} save to your Spotify account`,
      });
      setPlaylistName("");
    } catch (err) {
      api.error({
        message: err.message,
        placement: "top",
      });
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
            <AutoComplete
              onChange={onSelectOption}
              style={{ width: "100%" }}
              size="large"
              showSearch
              placeholder="Select the mood/occasion"
              disabled={isFetching}
              loading={isFetching}
              options={options}
            ></AutoComplete>
          </Col>
        </Row>

        <Row justify={"center"}>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <Button
              style={{ marginTop: 16 }}
              size="large"
              className="theme-btn full-width"
              disabled={!selectOption}
              loading={isFetching}
              onClick={onGenerate}
            >
              {isFetching ? "Generating..." : "Generate a new playlist"}
            </Button>
          </Col>
        </Row>

        {!!spotifyTracks.length && (
          <Row justify={"end"} style={{ margin: "20px 0px" }}>
            <Col xxl={5} xl={5} lg={6} md={8} sm={24} xs={24}>
              <Button
                size="large"
                className="full-width"
                icon={<SpotifyFilled />}
                onClick={onSave}
                loading={isFetching}
                style={{ backgroundColor: "#1db954" }}
                type="primary"
              >
                Save Playlist to Spotify
              </Button>
            </Col>
          </Row>
        )}

        <Row gutter={[20, 20]} justify={"center"} className="list">
          {isFetching && (
            <Col span={"auto"} style={{ marginTop: 80, textAlign: "center" }}>
              <LoadingOutlined
                style={{ fontSize: "3rem" }}
                color="primary"
                type="primary"
              />
            </Col>
          )}
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
                      <Col span={24}>
                        <b>Release date: </b>
                        {track.album.release_date}
                      </Col>
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
