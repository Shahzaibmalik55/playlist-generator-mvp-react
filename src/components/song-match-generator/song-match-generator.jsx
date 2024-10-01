import { useState } from "react";
import { Button, Card, Col, Image, Input, Modal, Row, Typography } from "antd";
import {
  FileOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlayCircleFilled,
  SpotifyFilled,
} from "@ant-design/icons";
import { savePlaylist } from "../../apis/save-playlist";
import { useAuth } from "../../hooks/useAuth";
import "./song-match-generator.scss";
import { useNotification } from "../../hooks/notification";
import { spotifySearch } from "../../apis/spotify-search";

const { Title } = Typography;

const { Search } = Input;

export const SongMatchGenerator = () => {
  const { api } = useNotification();

  const [isFetching, setIsFetching] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const [spotifyTracks, setSpotifyTracks] = useState([]);

  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState();

  const [searchedText, setSearchedText] = useState("");

  const [playlistName, setPlaylistName] = useState("");

  const searchArtist = async (text) => {
    try {
      setSearchedText(text);
      if (!text) {
        return;
      }
      setSpotifyTracks([]);
      setIsSearching(true);
      const query = {
        q: text,
        type: "track",
      };
      const data = await spotifySearch(query);
      setSpotifyTracks(data.tracks.items);
    } catch (err) {
      api.error({
        message: err.message,
        placement: "top",
      });
    } finally {
      setIsSearching(false);
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
            <Title style={{ textAlign: "center" }}>Song Search</Title>
          </Col>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Search
              onSearch={(text) => searchArtist(text)}
              style={{ width: "100%" }}
              size="large"
              placeholder="Search for tracks/songs"
              disabled={isFetching}
              loading={isSearching}
            />
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

        <Row gutter={[20, 20]} className="list" justify={"center"}>
          {!isSearching && !!searchedText && !spotifyTracks.length && (
            <Col span={"auto"} style={{ marginTop: 80, textAlign: "center" }}>
              <FileOutlined style={{ fontSize: "4rem" }} />
              <div style={{ marginTop: 12, fontSize: 24 }}>
                No Results Found
              </div>
            </Col>
          )}
          {isSearching && (
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
