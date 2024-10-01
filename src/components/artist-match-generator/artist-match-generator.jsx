import { useCallback, useEffect, useState } from "react";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Image,
  Input,
  Modal,
  Row,
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
import { useNotification } from "../../hooks/notification";
import { spotifySearch } from "../../apis/spotify-search";
import debounce from "lodash/debounce";

import "./artist-match-generator.scss";
import { getArtists } from "../../apis/get-artists";

const { Title } = Typography;

export const ArtistMatchGenerator = () => {
  const { api } = useNotification();

  const [isFetching, setIsFetching] = useState(false);

  const [spotifyTracks, setSpotifyTracks] = useState([]);

  const { user } = useAuth();

  const [selectedOption, setSelectedOption] = useState("");

  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState();

  const [playlistName, setPlaylistName] = useState("");

  const [artists, setArtists] = useState([]);

  const getArtist = async () => {
    try {
      setIsFetching(true);
      const data = await getArtists();
      const artistsOptions = data.items.map((artist) => ({
        label: artist.name,
        value: artist.id,
        image: artist.images[0]?.url,
        id: artist.id,
      }));
      setArtists(artistsOptions);
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getArtist();
  }, []);

  const searchArtist = async (text) => {
    try {
      if (!text) {
        return;
      }
      const query = {
        q: text,
        limit: 10,
        type: "artist",
      };
      const data = await spotifySearch(query);
      const artistsOptions = data.artists.items.map((artist) => {
        return {
          label: artist.name,
          value: artist.id,
          image: artist.images[0]?.url,
          id: artist.id,
        };
      });
      setArtists([...artistsOptions]);
    } catch (err) {
      api.error({
        message: err.message,
        placement: "top",
      });
    }
  };

  const delayedSearch = useCallback(
    debounce((text) => searchArtist(text), 1000),
    []
  );

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

  const onSelectOption = (value) => {
    setSelectedOption(value);
    const name = artists.find((artist) => artist.value === value)?.label;
    setSearchText(name || "");
    setSpotifyTracks([]);
  };

  const onGenerate = async () => {
    try {
      setSpotifyTracks([]);
      setIsFetching(true);
      const data = await generatePlaylist({ artist: selectedOption });
      setSpotifyTracks(data.tracks);
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
            <Title style={{ textAlign: "center" }}>Artist Match</Title>
          </Col>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <AutoComplete
              onSearch={(text) => {
                setSearchText();
                delayedSearch(text);
              }}
              onSelect={onSelectOption}
              style={{ width: "100%" }}
              size="large"
              placeholder="Search for the artist"
              disabled={isFetching}
              options={artists}
              value={searchText}
            />
          </Col>
        </Row>

        <Row justify={"center"}>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <Button
              style={{ marginTop: 16 }}
              size="large"
              className="theme-btn full-width"
              disabled={!selectedOption}
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
