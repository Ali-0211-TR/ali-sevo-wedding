import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tabs,
  Tag,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { blogApi } from '@/api/client';

const { Title } = Typography;
const { TextArea } = Input;

const LANGS = ['ru', 'uz', 'en', 'tr'] as const;

interface BlogRecord {
  id: string;
  slug: string;
  title: Record<string, string>;
  excerpt?: Record<string, string>;
  content: Record<string, string>;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await blogApi.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setPosts(list);
    } catch {
      message.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (title: Record<string, string>) => {
    if (!title || typeof title !== 'object') return String(title ?? '—');
    return title.ru || title.en || Object.values(title)[0] || '—';
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ isPublished: false });
    setModalOpen(true);
  };

  const openEdit = (post: BlogRecord) => {
    setEditing(post);
    const titleObj = post.title || {};
    const excerptObj = post.excerpt || {};
    const contentObj = post.content || {};

    const values: any = {
      slug: post.slug,
      coverImage: post.coverImage,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt ? dayjs(post.publishedAt) : null,
    };

    LANGS.forEach((lang) => {
      values[`title_${lang}`] = titleObj[lang] || '';
      values[`excerpt_${lang}`] = excerptObj[lang] || '';
      values[`content_${lang}`] = contentObj[lang] || '';
    });

    form.setFieldsValue(values);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload: any = {
        slug: values.slug,
        title: {} as Record<string, string>,
        excerpt: {} as Record<string, string>,
        content: {} as Record<string, string>,
        coverImage: values.coverImage || null,
        isPublished: values.isPublished ?? false,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : null,
      };

      LANGS.forEach((lang) => {
        payload.title[lang] = values[`title_${lang}`] || '';
        payload.excerpt[lang] = values[`excerpt_${lang}`] || '';
        payload.content[lang] = values[`content_${lang}`] || '';
      });

      if (editing) {
        await blogApi.update(editing.id, payload);
        message.success('Post updated');
      } else {
        await blogApi.create(payload);
        message.success('Post created');
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogApi.delete(id);
      message.success('Post deleted');
      fetchPosts();
    } catch {
      message.error('Failed to delete post');
    }
  };

  const handleTogglePublish = async (post: BlogRecord, checked: boolean) => {
    try {
      await blogApi.update(post.id, { isPublished: checked });
      message.success(checked ? 'Published' : 'Unpublished');
      fetchPosts();
    } catch {
      message.error('Failed to update');
    }
  };

  const columns: ColumnsType<BlogRecord> = [
    {
      title: 'Title',
      key: 'title',
      render: (_: any, r: BlogRecord) => getTitle(r.title),
      sorter: (a, b) => getTitle(a.title).localeCompare(getTitle(b.title)),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (v: string) => <Tag>/{v}</Tag>,
    },
    {
      title: 'Published',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 100,
      render: (v: boolean, r: BlogRecord) => (
        <Switch
          checked={v}
          size="small"
          onChange={(checked) => handleTogglePublish(r, checked)}
        />
      ),
    },
    {
      title: 'Published At',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 160,
      render: (v: string) => (v ? dayjs(v).format('DD MMM YYYY') : '—'),
      sorter: (a, b) => {
        const da = a.publishedAt ? dayjs(a.publishedAt).unix() : 0;
        const db = b.publishedAt ? dayjs(b.publishedAt).unix() : 0;
        return da - db;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: BlogRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Blog Posts</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Post
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={posts}
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing ? 'Edit Post' : 'Create Post'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Slug is required' }]}
          >
            <Input placeholder="e.g. our-love-story" />
          </Form.Item>

          <Tabs
            items={LANGS.map((lang) => ({
              key: lang,
              label: lang.toUpperCase(),
              children: (
                <>
                  <Form.Item
                    name={`title_${lang}`}
                    label={`Title (${lang.toUpperCase()})`}
                    rules={
                      lang === 'ru'
                        ? [{ required: true, message: 'Russian title is required' }]
                        : []
                    }
                  >
                    <Input placeholder={`Title in ${lang.toUpperCase()}`} />
                  </Form.Item>
                  <Form.Item name={`excerpt_${lang}`} label={`Excerpt (${lang.toUpperCase()})`}>
                    <TextArea rows={2} placeholder={`Excerpt in ${lang.toUpperCase()}`} />
                  </Form.Item>
                  <Form.Item name={`content_${lang}`} label={`Content (${lang.toUpperCase()})`}>
                    <TextArea rows={6} placeholder={`Content in ${lang.toUpperCase()}`} />
                  </Form.Item>
                </>
              ),
            }))}
          />

          <Form.Item name="coverImage" label="Cover Image URL">
            <Input placeholder="https://..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isPublished" label="Published" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="publishedAt" label="Published At">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
