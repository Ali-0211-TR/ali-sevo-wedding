import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
  message,
  Upload,
  Spin,
  Empty,
  Tooltip,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  FileImageOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { mediaApi } from '@/api/client';

const { Title, Text } = Typography;

interface MediaRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  alt?: string;
  createdAt: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function MediaThumbnail({ media }: { media: MediaRecord }) {
  if (media.type === 'IMAGE') {
    return (
      <img
        src={media.thumbnailUrl || media.url}
        alt={media.alt || media.originalName}
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          borderRadius: 4,
        }}
      />
    );
  }
  if (media.type === 'VIDEO') {
    return (
      <div
        style={{
          width: '100%',
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: 4,
        }}
      >
        <PlayCircleOutlined style={{ fontSize: 48, color: '#999' }} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0',
        borderRadius: 4,
      }}
    >
      <SoundOutlined style={{ fontSize: 48, color: '#999' }} />
    </div>
  );
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await mediaApi.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setMedia(list);
    } catch {
      message.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await mediaApi.upload(file);
      message.success('File uploaded');
      fetchMedia();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mediaApi.delete(id);
      message.success('Media deleted');
      fetchMedia();
    } catch {
      message.error('Failed to delete media');
    }
  };

  const copyUrl = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    message.success('URL copied to clipboard');
  };

  const typeColorMap: Record<string, string> = {
    IMAGE: 'green',
    VIDEO: 'blue',
    AUDIO: 'purple',
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <FileImageOutlined style={{ marginRight: 8 }} />
            Media Library
          </Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchMedia} loading={loading}>
              Refresh
            </Button>
            <Upload
              showUploadList={false}
              accept="image/*,video/*,audio/*"
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
                Upload
              </Button>
            </Upload>
          </Space>
        </Col>
      </Row>

      {loading && media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : media.length === 0 ? (
        <Empty description="No media files yet. Upload your first file!" />
      ) : (
        <Row gutter={[16, 16]}>
          {media.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                size="small"
                cover={<MediaThumbnail media={item} />}
                actions={[
                  <Tooltip title="Copy URL" key="copy">
                    <CopyOutlined onClick={() => copyUrl(item.url)} />
                  </Tooltip>,
                  <Popconfirm
                    key="delete"
                    title="Delete this file?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <Tooltip title={item.originalName}>
                      <Text ellipsis style={{ fontSize: 12 }}>
                        {item.originalName}
                      </Text>
                    </Tooltip>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Tag color={typeColorMap[item.type]} style={{ fontSize: 10 }}>
                        {item.type}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatFileSize(item.size)}
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
