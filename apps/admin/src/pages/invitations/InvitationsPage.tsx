import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  LinkOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { invitationsApi, guestsApi, eventsApi } from '@/api/client';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

const TYPES = ['INDIVIDUAL', 'COUPLE', 'FAMILY'] as const;
const LANGUAGES = ['RU', 'UZ', 'EN', 'TR'] as const;

const typeColorMap: Record<string, string> = {
  INDIVIDUAL: 'blue',
  COUPLE: 'magenta',
  FAMILY: 'green',
};

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [allGuests, setAllGuests] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [invRes, guestsRes, eventsRes] = await Promise.all([
        invitationsApi.getAll(),
        guestsApi.getAll(),
        eventsApi.getAll(),
      ]);
      const invList = Array.isArray(invRes.data) ? invRes.data : invRes.data.data || [];
      const gList = Array.isArray(guestsRes.data) ? guestsRes.data : guestsRes.data.data || [];
      const eList = Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data.data || [];
      setInvitations(invList);
      setAllGuests(gList);
      setAllEvents(eList);
    } catch {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (slug: string) => {
    const origin = window.location.origin.replace('5173', '3000');
    return `${origin}/invite/${slug}`;
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(getPublicUrl(slug));
    message.success('Link copied to clipboard!');
  };

  const getEventTitle = (titleJson: any) => {
    if (!titleJson) return '—';
    if (typeof titleJson === 'string') {
      try {
        titleJson = JSON.parse(titleJson);
      } catch {
        return titleJson;
      }
    }
    return titleJson.ru || titleJson.en || Object.values(titleJson)[0] || '—';
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ type: 'INDIVIDUAL', language: 'RU' });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    const guestIds = (item.guests || []).map((g: any) => g.id);
    const eventIds = (item.invitationEvents || []).map(
      (ie: any) => ie.eventId || ie.event?.id,
    );
    form.setFieldsValue({
      ...item,
      guestIds,
      eventIds,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        slug: values.slug,
        type: values.type,
        language: values.language,
        customGreeting: values.customGreeting || null,
        customMessage: values.customMessage || null,
        customClosing: values.customClosing || null,
        guestIds: values.guestIds || [],
        eventIds: values.eventIds || [],
      };

      if (editingItem) {
        await invitationsApi.update(editingItem.id, payload);
        message.success('Invitation updated');
      } else {
        await invitationsApi.create(payload);
        message.success('Invitation created');
      }
      setModalOpen(false);
      fetchAll();
    } catch (err: any) {
      if (err.response) {
        message.error(err.response?.data?.message || 'Operation failed');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await invitationsApi.delete(id);
      message.success('Invitation deleted');
      fetchAll();
    } catch {
      message.error('Failed to delete invitation');
    }
  };

  const columns = [
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => (
        <a href={getPublicUrl(slug)} target="_blank" rel="noopener noreferrer">
          <Space>
            <LinkOutlined />
            {slug}
          </Space>
        </a>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (v: string) => (
        <Tag color={typeColorMap[v] || 'default'}>{v}</Tag>
      ),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: 'Guests',
      key: 'guests',
      width: 80,
      render: (_: any, r: any) => (r.guests || []).length,
    },
    {
      title: 'Events',
      key: 'events',
      width: 80,
      render: (_: any, r: any) => (r.invitationEvents || []).length,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (v: string) => dayjs(v).format('DD MMM YYYY'),
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Copy Link">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyLink(record.slug)}
            />
          </Tooltip>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete this invitation?"
            description="All guest assignments will be removed."
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
          <Title level={3} style={{ margin: 0 }}>
            Invitations
          </Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchAll} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Invitation
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={invitations}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t: number) => `Total: ${t}` }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingItem ? 'Edit Invitation' : 'Add Invitation'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingItem ? 'Update' : 'Create'}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="e.g. john-and-jane" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true }]}
              >
                <Select>
                  {TYPES.map((t) => (
                    <Select.Option key={t} value={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true }]}
              >
                <Select>
                  {LANGUAGES.map((l) => (
                    <Select.Option key={l} value={l}>
                      {l}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="guestIds" label="Guests">
            <Select
              mode="multiple"
              placeholder="Select guests"
              optionFilterProp="label"
              options={allGuests.map((g: any) => ({
                label: `${g.firstName} ${g.lastName}`,
                value: g.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="eventIds" label="Events">
            <Select
              mode="multiple"
              placeholder="Select events"
              optionFilterProp="label"
              options={allEvents.map((e: any) => ({
                label: getEventTitle(e.title),
                value: e.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="customGreeting" label="Custom Greeting">
            <TextArea rows={2} placeholder="Optional custom greeting text" />
          </Form.Item>

          <Form.Item name="customMessage" label="Custom Message">
            <TextArea rows={3} placeholder="Optional custom message" />
          </Form.Item>

          <Form.Item name="customClosing" label="Custom Closing">
            <TextArea rows={2} placeholder="Optional custom closing text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
