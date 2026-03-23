import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Spin } from 'antd';
import {
  TeamOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { guestsApi, invitationsApi, eventsApi, pagesApi } from '@/api/client';
import dayjs from 'dayjs';

const { Title } = Typography;

interface Stats {
  totalGuests: number;
  totalInvitations: number;
  acceptedRsvps: number;
  pendingRsvps: number;
  totalEvents: number;
  totalPages: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalGuests: 0,
    totalInvitations: 0,
    acceptedRsvps: 0,
    pendingRsvps: 0,
    totalEvents: 0,
    totalPages: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [guestsRes, invitationsRes, eventsRes, pagesRes] =
        await Promise.all([
          guestsApi.getAll(),
          invitationsApi.getAll(),
          eventsApi.getAll(),
          pagesApi.getAll(),
        ]);

      const guests = guestsRes.data;
      const invitations = invitationsRes.data;
      const events = eventsRes.data;
      const pages = pagesRes.data;

      // Handle both array and paginated responses
      const guestsList = Array.isArray(guests) ? guests : guests.data || [];
      const invitationsList = Array.isArray(invitations) ? invitations : invitations.data || [];
      const eventsList = Array.isArray(events) ? events : events.data || [];
      const pagesList = Array.isArray(pages) ? pages : pages.data || [];

      setStats({
        totalGuests: guestsList.length,
        totalInvitations: invitationsList.length,
        acceptedRsvps: guestsList.filter(
          (g: any) => g.rsvpStatus === 'ACCEPTED',
        ).length,
        pendingRsvps: guestsList.filter(
          (g: any) => g.rsvpStatus === 'PENDING',
        ).length,
        totalEvents: eventsList.length,
        totalPages: pagesList.length,
      });

      const upcoming = eventsList
        .filter((e: any) => dayjs(e.date).isAfter(dayjs()))
        .sort(
          (a: any, b: any) =>
            dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
        )
        .slice(0, 5);
      setUpcomingEvents(upcoming);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (titleJson: any) => {
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Guests"
              value={stats.totalGuests}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Invitations"
              value={stats.totalInvitations}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Accepted RSVPs"
              value={stats.acceptedRsvps}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Pending RSVPs"
              value={stats.pendingRsvps}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Events"
              value={stats.totalEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Pages"
              value={stats.totalPages}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Upcoming Events"
        style={{ marginTop: 24 }}
        bordered={false}
      >
        {upcomingEvents.length === 0 ? (
          <Typography.Text type="secondary">
            No upcoming events
          </Typography.Text>
        ) : (
          <List
            dataSource={upcomingEvents}
            renderItem={(event: any) => (
              <List.Item
                extra={
                  <Tag color="blue">
                    {dayjs(event.date).format('DD MMM YYYY, HH:mm')}
                  </Tag>
                }
              >
                <List.Item.Meta
                  title={getTitle(event.title)}
                  description={event.location || 'No location set'}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
