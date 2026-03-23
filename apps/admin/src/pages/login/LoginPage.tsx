import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, MailOutlined, HeartFilled } from '@ant-design/icons';
import { authApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s: { login: (token: string, user: any) => void }) => s.login);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(values.email, values.password);
      login(data.access_token, data.user);
      message.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      message.error(
        err.response?.data?.message || 'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd3 50%, #dbc8b0 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
        bordered={false}
      >
        <Space
          direction="vertical"
          align="center"
          style={{ width: '100%', marginBottom: 24 }}
        >
          <HeartFilled style={{ fontSize: 40, color: '#b08968' }} />
          <Title level={3} style={{ margin: 0, color: '#7f5539' }}>
            Wedding Admin
          </Title>
          <Text type="secondary">Sign in to manage your wedding</Text>
        </Space>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{ background: '#b08968', borderColor: '#b08968' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
