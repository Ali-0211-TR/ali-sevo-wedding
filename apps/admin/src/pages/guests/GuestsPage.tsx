import { useState, useEffect, useMemo } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { guestsApi } from '@/api/client';

const { Title } = Typography;

const LANGUAGES = ['RU', 'UZ', 'EN', 'TR'] as const;
const RSVP_STATUSES = ['PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE'] as const;

const rsvpColorMap: Record<string, string> = {
  PENDING: 'orange',
  ACCEPTED: 'green',
  DECLINED: 'red',
  MAYBE: 'blue',
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string | undefined>();
  const [rsvpFilter, setRsvpFilter] = useState<string | undefined>();

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data } = await guestsApi.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setGuests(list);
    } catch {
      message.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((g: any) => {
      const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
      if (searchText && !fullName.includes(searchText.toLowerCase()))
        return false;
      if (languageFilter && g.language !== languageFilter) return false;
      if (rsvpFilter && g.rsvpStatus !== rsvpFilter) return false;
      return true;
    });
  }, [guests, searchText, languageFilter, rsvpFilter]);

  const openCreateModal = () => {
    setEditingGuest(null);
    form.resetFields();
    form.setFieldsValue({ language: 'RU', rsvpStatus: 'PENDING', plusOne: false });
    setModalOpen(true);
  };

  const openEditModal = (guest: any) => {
    setEditingGuest(guest);
    form.setFieldsValue(guest);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingGuest) {
        await guestsApi.update(editingGuest.id, values);
        message.success('Guest updated');
      } else {
        await guestsApi.create(values);
        message.success('Guest created');
      }
      setModalOpen(false);
      fetchGuests();
    } catch (err: any) {
      if (err.response) {
        message.error(err.response?.data?.message || 'Operation failed');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await guestsApi.delete(id);
      message.success('Guest deleted');
      fetchGuests();
    } catch {
      message.error('Failed to delete guest');
    }
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, r: any) => `${r.firstName} ${r.lastName}`,
      sorter: (a: any, b: any) =>
        a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => v || '—',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (v: string) => v || '—',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: 'RSVP Status',
      dataIndex: 'rsvpStatus',
      key: 'rsvpStatus',
      width: 130,
      render: (v: string) => (
        <Tag color={rsvpColorMap[v] || 'default'}>{v}</Tag>
      ),
    },
    {
      title: 'Invitation',
      dataIndex: 'invitationId',
      key: 'invitationId',
      render: (v: string, r: any) =>
        r.invitation ? (
          <Tag color="purple">{r.invitation.slug}</Tag>
        ) : (
          <Tag>Unassigned</Tag>
        ),
    },
    {
      title: 'Dietary Needs',
      dataIndex: 'dietaryNeeds',
      key: 'dietaryNeeds',
      render: (v: string) => v || '—',
      responsive: ['lg'] as any,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete this guest?"
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
            Guests
          </Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchGuests} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Guest
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input
            placeholder="Search by name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={12} sm={4}>
          <Select
            placeholder="Language"
            value={languageFilter}
            onChange={setLanguageFilter}
            allowClear
            style={{ width: '100%' }}
          >
            {LANGUAGES.map((l) => (
              <Select.Option key={l} value={l}>
                {l}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} sm={4}>
          <Select
            placeholder="RSVP Status"
            value={rsvpFilter}
            onChange={setRsvpFilter}
            allowClear
            style={{ width: '100%' }}
          >
            {RSVP_STATUSES.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        dataSource={filteredGuests}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t: number) => `Total: ${t}` }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={editingGuest ? 'Edit Guest' : 'Add Guest'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingGuest ? 'Update' : 'Create'}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item name="rsvpStatus" label="RSVP Status">
                <Select>
                  {RSVP_STATUSES.map((s) => (
                    <Select.Option key={s} value={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="plusOne" label="Plus One" valuePropName="checked">
                <Select>
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="dietaryNeeds" label="Dietary Needs">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
