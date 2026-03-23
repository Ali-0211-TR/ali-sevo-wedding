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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { usersApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

const { Title } = Typography;

const ROLES = ['SUPER_ADMIN', 'MANAGER', 'VIEWER'] as const;

const roleColorMap: Record<string, string> = {
  SUPER_ADMIN: 'red',
  MANAGER: 'blue',
  VIEWER: 'default',
};

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await usersApi.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setUsers(list);
    } catch {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ role: 'VIEWER' });
    setModalOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditing(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload: any = {
        name: values.name,
        email: values.email,
        role: values.role,
      };

      // Only include password if provided
      if (values.password) {
        payload.password = values.password;
      }

      if (editing) {
        await usersApi.update(editing.id, payload);
        message.success('User updated');
      } else {
        await usersApi.create(payload);
        message.success('User created');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      message.warning("You can't delete your own account");
      return;
    }
    try {
      await usersApi.delete(id);
      message.success('User deleted');
      fetchUsers();
    } catch {
      message.error('Failed to delete user');
    }
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      render: (v: string) => <Tag color={roleColorMap[v] || 'default'}>{v}</Tag>,
      filters: ROLES.map((r) => ({ text: r, value: r })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (v: string) => dayjs(v).format('DD MMM YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: UserRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this user?"
            description={
              currentUser?.id === record.id
                ? "You can't delete your own account"
                : undefined
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              disabled: currentUser?.id === record.id,
            }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={currentUser?.id === record.id}
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
          <Title level={3} style={{ margin: 0 }}>Users</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add User
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing ? 'Edit User' : 'Create User'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email' },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={editing ? 'Password (leave blank to keep current)' : 'Password'}
            rules={
              editing
                ? []
                : [{ required: true, message: 'Password is required' }]
            }
          >
            <Input.Password placeholder={editing ? 'Leave blank to keep current' : 'Enter password'} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select
              options={ROLES.map((r) => ({
                value: r,
                label: (
                  <Tag color={roleColorMap[r]}>{r}</Tag>
                ),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
