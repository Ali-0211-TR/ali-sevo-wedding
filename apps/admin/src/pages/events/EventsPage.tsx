import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Switch,
  DatePicker,
  Tabs,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { eventsApi } from '@/api/client';

const { Title } = Typography;

const LANGUAGES = ['RU', 'UZ', 'EN', 'TR'] as const;

interface EventRecord {
  id: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  location?: string;
  address?: string;
  mapUrl?: string;
  date: string;
  endDate?: string;
  sortOrder: number;
  isPublished: boolean;
  coverImage?: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventsApi.getAll();
      setEvents(data);
    } catch {
      message.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (title: Record<string, string>) => {
    if (typeof title === 'object') {
      return title.ru || title.en || Object.values(title)[0] || '—';
    }
    return String(title);
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      sortOrder: 0,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEdit = (event: EventRecord) => {
    setEditing(event);
    const titleObj = event.title || {};
    const descObj = event.description || {};
    form.setFieldsValue({
      title_ru: titleObj.ru || '',
      title_uz: titleObj.uz || '',
      title_en: titleObj.en || '',
      title_tr: titleObj.tr || '',
      description_ru: descObj.ru || '',
      description_uz: descObj.uz || '',
      description_en: descObj.en || '',
      description_tr: descObj.tr || '',
      location: event.location,
      address: event.address,
      mapUrl: event.mapUrl,
      date: event.date ? dayjs(event.date) : null,
      endDate: event.endDate ? dayjs(event.endDate) : null,
      sortOrder: event.sortOrder,
      isPublished: event.isPublished,
      coverImage: event.coverImage,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        title: {
          ru: values.title_ru || '',
          uz: values.title_uz || '',
          en: values.title_en || '',
          tr: values.title_tr || '',
        },
        description: {
          ru: values.description_ru || '',
          uz: values.description_uz || '',
          en: values.description_en || '',
          tr: values.description_tr || '',
        },
        location: values.location || null,
        address: values.address || null,
        mapUrl: values.mapUrl || null,
        date: values.date ? values.date.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        sortOrder: values.sortOrder ?? 0,
        isPublished: values.isPublished ?? true,
        coverImage: values.coverImage || null,
      };

      if (editing) {
        await eventsApi.update(editing.id, payload);
        message.success('Event updated');
      } else {
        await eventsApi.create(payload);
        message.success('Event created');
      }
      setModalOpen(false);
      fetchEvents();
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
      await eventsApi.delete(id);
      message.success('Event deleted');
      fetchEvents();
    } catch {
      message.error('Failed to delete event');
    }
  };

  const handleTogglePublish = async (event: EventRecord, checked: boolean) => {
    try {
      await eventsApi.update(event.id, { isPublished: checked });
      message.success(checked ? 'Published' : 'Unpublished');
      fetchEvents();
    } catch {
      message.error('Failed to update');
    }
  };

  const columns: ColumnsType<EventRecord> = [
    {
      title: 'Title',
      key: 'title',
      render: (_: any, r: EventRecord) => getTitle(r.title),
      sorter: (a: EventRecord, b: EventRecord) => getTitle(a.title).localeCompare(getTitle(b.title)),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      render: (d: string) => dayjs(d).format('DD MMM YYYY, HH:mm'),
      sorter: (a: EventRecord, b: EventRecord) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['md'],
      ellipsis: true,
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a: EventRecord, b: EventRecord) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Published',
      key: 'isPublished',
      width: 100,
      render: (_, r) => (
        <Switch
          checked={r.isPublished}
          onChange={(checked) => handleTogglePublish(r, checked)}
          size="small"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(r)}
          />
          <Popconfirm
            title="Delete this event?"
            onConfirm={() => handleDelete(r.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const translatableFields = (prefix: string, label: string, isTextArea = false) => (
    <Tabs
      size="small"
      items={LANGUAGES.map((lang) => ({
        key: lang,
        label: lang,
        children: (
          <Form.Item
            name={`${prefix}_${lang.toLowerCase()}`}
            label={`${label} (${lang})`}
            rules={
              lang === 'RU' && prefix === 'title'
                ? [{ required: true, message: `${label} (RU) is required` }]
                : undefined
            }
          >
            {isTextArea ? (
              <Input.TextArea rows={3} placeholder={`${label} in ${lang}`} />
            ) : (
              <Input placeholder={`${label} in ${lang}`} />
            )}
          </Form.Item>
        ),
      }))}
    />
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Events
          </Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Event
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={events}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editing ? 'Edit Event' : 'Add Event'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Save"
        confirmLoading={saving}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {translatableFields('title', 'Title')}
          {translatableFields('description', 'Description', true)}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="Venue name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="address" label="Address">
                <Input placeholder="Full address" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="mapUrl" label="Map URL">
            <Input placeholder="Google Maps or Yandex Maps link" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Start Date & Time"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker
                  showTime
                  format="DD.MM.YYYY HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date & Time">
                <DatePicker
                  showTime
                  format="DD.MM.YYYY HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sortOrder" label="Sort Order">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPublished"
                label="Published"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="coverImage" label="Cover Image URL">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
