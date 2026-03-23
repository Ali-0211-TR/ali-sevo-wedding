import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tabs,
  DatePicker,
  Spin,
  Divider,
  Tag,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { pagesApi, blocksApi } from '@/api/client';

const { Title, Text } = Typography;
const { TextArea } = Input;

const LANGS = ['ru', 'uz', 'en', 'tr'] as const;

const BLOCK_TYPES = [
  'HERO',
  'TEXT',
  'IMAGE',
  'GALLERY',
  'VIDEO',
  'COUNTDOWN',
  'EVENT_LIST',
  'RSVP_FORM',
  'MAP',
  'CUSTOM_HTML',
  'BLOG_LIST',
  'TIMELINE',
  'COUPLE_INFO',
] as const;

type BlockType = (typeof BLOCK_TYPES)[number];

const BLOCK_TYPE_COLORS: Record<string, string> = {
  HERO: 'magenta',
  TEXT: 'blue',
  IMAGE: 'green',
  GALLERY: 'cyan',
  VIDEO: 'purple',
  COUNTDOWN: 'volcano',
  EVENT_LIST: 'orange',
  RSVP_FORM: 'gold',
  MAP: 'lime',
  CUSTOM_HTML: 'geekblue',
  BLOG_LIST: 'red',
  TIMELINE: '#87d068',
  COUPLE_INFO: '#f50',
};

interface BlockRecord {
  id: string;
  type: BlockType;
  content: any;
  settings?: any;
  sortOrder: number;
  pageId: string;
}

interface PageRecord {
  id: string;
  slug: string;
  title: Record<string, string>;
  isPublished: boolean;
  showInNav: boolean;
  sortOrder: number;
  blocks: BlockRecord[];
}

// ─── Translatable Field Group ──────────────────────────────
function TranslatableFields({
  prefix,
  label,
  textarea,
}: {
  prefix: string;
  label: string;
  textarea?: boolean;
}) {
  const Comp = textarea ? TextArea : Input;
  return (
    <Tabs
      size="small"
      items={LANGS.map((lang) => ({
        key: lang,
        label: lang.toUpperCase(),
        children: (
          <Form.Item name={[prefix, lang]} label={`${label} (${lang.toUpperCase()})`}>
            <Comp rows={textarea ? 4 : undefined} placeholder={`${label} in ${lang.toUpperCase()}`} />
          </Form.Item>
        ),
      }))}
    />
  );
}

// ─── Block Content Forms ────────────────────────────────────
function HeroFields() {
  return (
    <>
      <TranslatableFields prefix="title" label="Title" />
      <TranslatableFields prefix="subtitle" label="Subtitle" />
      <Form.Item name="backgroundImage" label="Background Image URL">
        <Input placeholder="https://..." />
      </Form.Item>
    </>
  );
}

function TextFields() {
  return <TranslatableFields prefix="content" label="Content" textarea />;
}

function ImageFields() {
  return (
    <>
      <Form.Item name="url" label="Image URL">
        <Input placeholder="https://..." />
      </Form.Item>
      <Form.Item name="alt" label="Alt Text">
        <Input />
      </Form.Item>
      <TranslatableFields prefix="caption" label="Caption" />
    </>
  );
}

function GalleryFields() {
  return (
    <Form.List name="images">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...rest }) => (
            <Card
              key={key}
              size="small"
              style={{ marginBottom: 8 }}
              extra={
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
              }
            >
              <Form.Item {...rest} name={[name, 'url']} label="URL">
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item {...rest} name={[name, 'alt']} label="Alt">
                <Input />
              </Form.Item>
            </Card>
          ))}
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Image
          </Button>
        </>
      )}
    </Form.List>
  );
}

function VideoFields() {
  return (
    <>
      <Form.Item name="videoUrl" label="Video URL">
        <Input placeholder="https://..." />
      </Form.Item>
      <Form.Item name="poster" label="Poster Image URL">
        <Input placeholder="https://..." />
      </Form.Item>
    </>
  );
}

function CountdownFields() {
  return (
    <>
      <Form.Item name="targetDate" label="Target Date">
        <DatePicker showTime style={{ width: '100%' }} />
      </Form.Item>
      <TranslatableFields prefix="title" label="Title" />
    </>
  );
}

function EventListFields() {
  return <TranslatableFields prefix="title" label="Title" />;
}

function RsvpFormFields() {
  return <TranslatableFields prefix="title" label="Title" />;
}

function MapFields() {
  return (
    <>
      <Form.Item name="embedUrl" label="Map Embed URL">
        <Input placeholder="https://maps.google.com/..." />
      </Form.Item>
      <TranslatableFields prefix="title" label="Title" />
    </>
  );
}

function CustomHtmlFields() {
  return (
    <Form.Item name="html" label="HTML">
      <TextArea rows={10} placeholder="<div>Your custom HTML...</div>" />
    </Form.Item>
  );
}

function BlogListFields() {
  return (
    <>
      <TranslatableFields prefix="title" label="Title" />
      <Form.Item name="limit" label="Limit (number of posts)">
        <InputNumber min={1} max={100} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}

function TimelineFields() {
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...rest }) => (
            <Card
              key={key}
              size="small"
              style={{ marginBottom: 8 }}
              title={`Item ${name + 1}`}
              extra={
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
              }
            >
              <Form.Item {...rest} name={[name, 'date']} label="Date">
                <Input placeholder="e.g. June 2020" />
              </Form.Item>
              <Tabs
                size="small"
                items={LANGS.map((lang) => ({
                  key: lang,
                  label: lang.toUpperCase(),
                  children: (
                    <>
                      <Form.Item {...rest} name={[name, 'title', lang]} label={`Title (${lang.toUpperCase()})`}>
                        <Input />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'description', lang]} label={`Description (${lang.toUpperCase()})`}>
                        <TextArea rows={2} />
                      </Form.Item>
                    </>
                  ),
                }))}
              />
            </Card>
          ))}
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Timeline Item
          </Button>
        </>
      )}
    </Form.List>
  );
}

function CoupleInfoFields() {
  return (
    <>
      <TranslatableFields prefix="groomName" label="Groom Name" />
      <TranslatableFields prefix="brideName" label="Bride Name" />
      <TranslatableFields prefix="story" label="Story" textarea />
    </>
  );
}

const BLOCK_FORM_MAP: Record<BlockType, React.FC> = {
  HERO: HeroFields,
  TEXT: TextFields,
  IMAGE: ImageFields,
  GALLERY: GalleryFields,
  VIDEO: VideoFields,
  COUNTDOWN: CountdownFields,
  EVENT_LIST: EventListFields,
  RSVP_FORM: RsvpFormFields,
  MAP: MapFields,
  CUSTOM_HTML: CustomHtmlFields,
  BLOG_LIST: BlogListFields,
  TIMELINE: TimelineFields,
  COUPLE_INFO: CoupleInfoFields,
};

// ─── Block Editor Component ─────────────────────────────────
function BlockEditor({
  block,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: BlockRecord;
  onSave: (id: string, content: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const content = block.content || {};
    // For COUNTDOWN, convert targetDate string to dayjs
    if (block.type === 'COUNTDOWN' && content.targetDate) {
      form.setFieldsValue({ ...content, targetDate: dayjs(content.targetDate) });
    } else {
      form.setFieldsValue(content);
    }
  }, [block, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      // Convert dayjs back to ISO string for COUNTDOWN
      if (block.type === 'COUNTDOWN' && values.targetDate) {
        values.targetDate = values.targetDate.toISOString();
      }
      await onSave(block.id, values);
    } finally {
      setSaving(false);
    }
  };

  const FormComponent = BLOCK_FORM_MAP[block.type];

  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={
        <Space>
          <HolderOutlined style={{ cursor: 'grab', color: '#999' }} />
          <Tag color={BLOCK_TYPE_COLORS[block.type]}>{block.type}</Tag>
          <Text type="secondary">Order: {block.sortOrder}</Text>
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={isFirst}
            onClick={() => onMoveUp(block.id)}
          />
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={isLast}
            onClick={() => onMoveDown(block.id)}
          />
          <Button
            size="small"
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
          >
            Save
          </Button>
          <Popconfirm
            title="Delete this block?"
            onConfirm={() => onDelete(block.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      }
    >
      <Form form={form} layout="vertical" size="small">
        {FormComponent && <FormComponent />}
      </Form>
    </Card>
  );
}

// ─── Page Editor ────────────────────────────────────────────
export default function PageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('TEXT');
  const [addingBlock, setAddingBlock] = useState(false);

  const fetchPage = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await pagesApi.getOne(id);
      // Sort blocks by sortOrder
      if (data.blocks) {
        data.blocks.sort((a: BlockRecord, b: BlockRecord) => a.sortOrder - b.sortOrder);
      }
      setPage(data);
    } catch {
      message.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const getTitle = (title: Record<string, string>) => {
    if (!title || typeof title !== 'object') return String(title ?? '—');
    return title.ru || title.en || Object.values(title)[0] || '—';
  };

  const handleSaveBlock = async (blockId: string, content: any) => {
    try {
      await blocksApi.update(blockId, { content });
      message.success('Block saved');
      fetchPage();
    } catch {
      message.error('Failed to save block');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await blocksApi.delete(blockId);
      message.success('Block deleted');
      fetchPage();
    } catch {
      message.error('Failed to delete block');
    }
  };

  const handleAddBlock = async () => {
    if (!page) return;
    setAddingBlock(true);
    try {
      const maxSort = page.blocks.length > 0
        ? Math.max(...page.blocks.map((b) => b.sortOrder))
        : -1;
      await blocksApi.create({
        pageId: page.id,
        type: selectedBlockType,
        content: {},
        sortOrder: maxSort + 1,
      });
      message.success('Block added');
      setAddModalOpen(false);
      fetchPage();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Failed to add block');
    } finally {
      setAddingBlock(false);
    }
  };

  const handleReorder = async (blockId: string, direction: 'up' | 'down') => {
    if (!page) return;
    const blocks = [...page.blocks];
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;

    // Swap sort orders
    const tempSort = blocks[idx].sortOrder;
    blocks[idx].sortOrder = blocks[swapIdx].sortOrder;
    blocks[swapIdx].sortOrder = tempSort;

    try {
      await blocksApi.reorder(
        blocks.map((b) => ({ id: b.id, sortOrder: b.sortOrder })),
      );
      fetchPage();
    } catch {
      message.error('Failed to reorder blocks');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Title level={4}>Page not found</Title>
        <Button onClick={() => navigate('/pages')}>Back to Pages</Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/pages')}
        style={{ marginBottom: 16 }}
      >
        Back to Pages
      </Button>

      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              {getTitle(page.title)}
            </Title>
            <Text type="secondary">/{page.slug}</Text>
          </Col>
          <Col>
            <Space>
              <Tag color={page.isPublished ? 'green' : 'default'}>
                {page.isPublished ? 'Published' : 'Draft'}
              </Tag>
              {page.showInNav && <Tag color="blue">In Nav</Tag>}
            </Space>
          </Col>
        </Row>
      </Card>

      <Divider orientation="left">
        Blocks ({page.blocks.length})
      </Divider>

      <Collapse
        accordion
        items={page.blocks.map((block, idx) => ({
          key: block.id,
          label: (
            <Space>
              <Tag color={BLOCK_TYPE_COLORS[block.type]}>{block.type}</Tag>
              <Text type="secondary">#{idx + 1} (order: {block.sortOrder})</Text>
            </Space>
          ),
          children: (
            <BlockEditor
              block={block}
              onSave={handleSaveBlock}
              onDelete={handleDeleteBlock}
              onMoveUp={(bId) => handleReorder(bId, 'up')}
              onMoveDown={(bId) => handleReorder(bId, 'down')}
              isFirst={idx === 0}
              isLast={idx === page.blocks.length - 1}
            />
          ),
        }))}
      />

      {page.blocks.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">No blocks yet. Add your first block below.</Text>
        </Card>
      )}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button
          type="dashed"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Block
        </Button>
      </div>

      <Modal
        title="Add Block"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={handleAddBlock}
        confirmLoading={addingBlock}
        okText="Add"
      >
        <Form layout="vertical">
          <Form.Item label="Block Type">
            <Select
              value={selectedBlockType}
              onChange={(v) => setSelectedBlockType(v)}
              options={BLOCK_TYPES.map((t) => ({
                value: t,
                label: (
                  <Space>
                    <Tag color={BLOCK_TYPE_COLORS[t]}>{t}</Tag>
                  </Space>
                ),
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
