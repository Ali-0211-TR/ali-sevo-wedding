import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tabs,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { pagesApi } from '@/api/client';

const { Title } = Typography;

const LANGS = ['ru', 'uz', 'en', 'tr'] as const;

interface PageRecord {
  id: string;
  slug: string;
  title: Record<string, string>;
  isPublished: boolean;
  showInNav: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function PagesListPage() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data } = await pagesApi.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setPages(list);
    } catch {
      message.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (title: Record<string, string>) => {
    if (!title || typeof title !== 'object') return String(title ?? '—');
    return title.ru || title.en || Object.values(title)[0] || '—';
  };

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ isPublished: false, showInNav: true, sortOrder: 0 });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        slug: values.slug,
        title: {
          ru: values.title_ru || '',
          uz: values.title_uz || '',
          en: values.title_en || '',
          tr: values.title_tr || '',
        },
        isPublished: values.isPublished ?? false,
        showInNav: values.showInNav ?? true,
        sortOrder: values.sortOrder ?? 0,
      };

      await pagesApi.create(payload);
      message.success('Page created');
      setModalOpen(false);
      fetchPages();
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
      await pagesApi.delete(id);
      message.success('Page deleted');
      fetchPages();
    } catch {
      message.error('Failed to delete page');
    }
  };

  const handleTogglePublish = async (page: PageRecord, checked: boolean) => {
    try {
      await pagesApi.update(page.id, { isPublished: checked });
      message.success(checked ? 'Published' : 'Unpublished');
      fetchPages();
    } catch {
      message.error('Failed to update');
    }
  };

  const columns: ColumnsType<PageRecord> = [
    {
      title: 'Title',
      key: 'title',
      render: (_: any, r: PageRecord) => getTitle(r.title),
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
      render: (v: boolean, r: PageRecord) => (
        <Switch
          checked={v}
          size="small"
          onChange={(checked) => handleTogglePublish(r, checked)}
        />
      ),
    },
    {
      title: 'Nav',
      dataIndex: 'showInNav',
      key: 'showInNav',
      width: 80,
      render: (v: boolean) => (v ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>),
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 70,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: PageRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pages/${record.id}`);
            }}
          />
          <Popconfirm
            title="Delete this page?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Pages</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Page
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={pages}
        loading={loading}
        pagination={{ pageSize: 20 }}
        onRow={(record) => ({
          onClick: () => navigate(`/pages/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Create Page"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Slug is required' }]}>
            <Input placeholder="e.g. home, about-us" />
          </Form.Item>

          <Tabs
            items={LANGS.map((lang) => ({
              key: lang,
              label: lang.toUpperCase(),
              children: (
                <Form.Item
                  name={`title_${lang}`}
                  label={`Title (${lang.toUpperCase()})`}
                  rules={lang === 'ru' ? [{ required: true, message: 'Russian title is required' }] : []}
                >
                  <Input placeholder={`Page title in ${lang.toUpperCase()}`} />
                </Form.Item>
              ),
            }))}
          />

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sortOrder" label="Sort Order">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isPublished" label="Published" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="showInNav" label="Show in Nav" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
