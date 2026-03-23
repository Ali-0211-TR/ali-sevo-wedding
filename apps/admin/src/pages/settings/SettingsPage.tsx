import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  DatePicker,
  Tabs,
  message,
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Divider,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { settingsApi } from '@/api/client';

const { Title } = Typography;

const LANGS = ['ru', 'uz', 'en', 'tr'] as const;

const FONT_OPTIONS = [
  'Playfair Display',
  'Great Vibes',
  'Cormorant Garamond',
  'Libre Baskerville',
  'Dancing Script',
  'Josefin Sans',
  'Montserrat',
  'Lato',
  'Roboto',
  'Open Sans',
  'Nunito',
  'Poppins',
  'Inter',
  'Raleway',
  'Merriweather',
].map((f) => ({ value: f, label: f }));

const LANGUAGE_OPTIONS = [
  { value: 'RU', label: 'Russian' },
  { value: 'UZ', label: 'Uzbek' },
  { value: 'EN', label: 'English' },
  { value: 'TR', label: 'Turkish' },
];

function TranslatableField({
  fieldName,
  label,
  textarea,
  form,
}: {
  fieldName: string;
  label: string;
  textarea?: boolean;
  form: any;
}) {
  const Comp = textarea ? Input.TextArea : Input;
  return (
    <Tabs
      size="small"
      items={LANGS.map((lang) => ({
        key: lang,
        label: lang.toUpperCase(),
        children: (
          <Form.Item name={[fieldName, lang]} label={`${label} (${lang.toUpperCase()})`}>
            <Comp
              rows={textarea ? 3 : undefined}
              placeholder={`${label} in ${lang.toUpperCase()}`}
            />
          </Form.Item>
        ),
      }))}
    />
  );
}

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await settingsApi.get();
      // Map settings to form values
      const values: any = {
        siteTitle: data.siteTitle || {},
        coupleNames: data.coupleNames || {},
        weddingDate: data.weddingDate ? dayjs(data.weddingDate) : null,
        venue: data.venue || {},
        venueAddress: data.venueAddress || {},
        primaryColor: data.primaryColor || '#b08968',
        secondaryColor: data.secondaryColor || '#ddb892',
        accentColor: data.accentColor || '#7f5539',
        fontFamily: data.fontFamily || 'Playfair Display',
        bodyFontFamily: data.bodyFontFamily || 'Lato',
        backgroundMusicUrl: data.backgroundMusicUrl || '',
        musicAutoplay: data.musicAutoplay ?? false,
        instagramUrl: data.instagramUrl || '',
        telegramUrl: data.telegramUrl || '',
        metaDescription: data.metaDescription || {},
        ogImage: data.ogImage || '',
        favicon: data.favicon || '',
        defaultLanguage: data.defaultLanguage || 'RU',
      };
      form.setFieldsValue(values);
    } catch {
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        siteTitle: values.siteTitle || {},
        coupleNames: values.coupleNames || {},
        weddingDate: values.weddingDate ? values.weddingDate.toISOString() : null,
        venue: values.venue || {},
        venueAddress: values.venueAddress || {},
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        accentColor: values.accentColor,
        fontFamily: values.fontFamily,
        bodyFontFamily: values.bodyFontFamily,
        backgroundMusicUrl: values.backgroundMusicUrl || null,
        musicAutoplay: values.musicAutoplay ?? false,
        instagramUrl: values.instagramUrl || null,
        telegramUrl: values.telegramUrl || null,
        metaDescription: values.metaDescription || {},
        ogImage: values.ogImage || null,
        favicon: values.favicon || null,
        defaultLanguage: values.defaultLanguage,
      };

      await settingsApi.update(payload);
      message.success('Settings saved');
    } catch (err: any) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Site Settings</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} size="large">
            Save Settings
          </Button>
        </Col>
      </Row>

      <Form form={form} layout="vertical">
        <Tabs
          type="card"
          items={[
            {
              key: 'general',
              label: 'General',
              children: (
                <Card>
                  <TranslatableField fieldName="siteTitle" label="Site Title" form={form} />
                  <Divider />
                  <TranslatableField fieldName="coupleNames" label="Couple Names" form={form} />
                  <Divider />
                  <Form.Item name="weddingDate" label="Wedding Date">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                  <Divider />
                  <TranslatableField fieldName="venue" label="Venue" form={form} />
                  <Divider />
                  <TranslatableField fieldName="venueAddress" label="Venue Address" form={form} />
                </Card>
              ),
            },
            {
              key: 'theme',
              label: 'Theme',
              children: (
                <Card>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item name="primaryColor" label="Primary Color">
                        <Input type="color" style={{ width: 80, height: 36, padding: 2 }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="secondaryColor" label="Secondary Color">
                        <Input type="color" style={{ width: 80, height: 36, padding: 2 }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="accentColor" label="Accent Color">
                        <Input type="color" style={{ width: 80, height: 36, padding: 2 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="fontFamily" label="Heading Font">
                        <Select options={FONT_OPTIONS} showSearch placeholder="Select font" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="bodyFontFamily" label="Body Font">
                        <Select options={FONT_OPTIONS} showSearch placeholder="Select font" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              key: 'music',
              label: 'Music',
              children: (
                <Card>
                  <Form.Item name="backgroundMusicUrl" label="Background Music URL">
                    <Input placeholder="https://example.com/music.mp3" />
                  </Form.Item>
                  <Form.Item name="musicAutoplay" label="Autoplay Music" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Card>
              ),
            },
            {
              key: 'social',
              label: 'Social',
              children: (
                <Card>
                  <Form.Item name="instagramUrl" label="Instagram URL">
                    <Input placeholder="https://instagram.com/..." />
                  </Form.Item>
                  <Form.Item name="telegramUrl" label="Telegram URL">
                    <Input placeholder="https://t.me/..." />
                  </Form.Item>
                </Card>
              ),
            },
            {
              key: 'seo',
              label: 'SEO',
              children: (
                <Card>
                  <TranslatableField
                    fieldName="metaDescription"
                    label="Meta Description"
                    textarea
                    form={form}
                  />
                  <Divider />
                  <Form.Item name="ogImage" label="OG Image URL">
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <Form.Item name="favicon" label="Favicon URL">
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <Form.Item name="defaultLanguage" label="Default Language">
                    <Select options={LANGUAGE_OPTIONS} />
                  </Form.Item>
                </Card>
              ),
            },
          ]}
        />
      </Form>
    </div>
  );
}
