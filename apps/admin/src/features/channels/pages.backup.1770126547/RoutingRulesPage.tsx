import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Drawer, message, Modal } from 'antd';
import { PlusOutlined, DragOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { PageHeader } from '@psp/ui';
import type { RoutingStrategy } from '../types/domain';
import { 
  useRoutingStrategies, 
  useCreateRoutingStrategy, 
  useUpdateRoutingStrategy,
  useReorderRoutingStrategies 
} from '../hooks';
import { RoutingStrategyForm } from '../components/RoutingStrategyForm';

// Draggable row component
interface DraggableRowProps {
  record: RoutingStrategy;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableRow({ record, index, moveRow, ...restProps }: DraggableRowProps & React.HTMLAttributes<HTMLTableRowElement>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: record.id,
  });

  const style: React.CSSProperties = {
    ...restProps.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      {...restProps}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {React.Children.map(restProps.children, (child, i) => (
        <td key={i}>
          {i === 0 ? (
            <span {...listeners} style={{ cursor: 'grab', padding: 8 }}>
              <DragOutlined />
            </span>
          ) : (
            (child as React.ReactElement).props.children
          )}
        </td>
      ))}
    </tr>
  );
}

export function RoutingRulesPage() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<RoutingStrategy | undefined>();
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [localStrategies, setLocalStrategies] = useState<RoutingStrategy[]>([]);
  
  const { data: strategies = [], isLoading } = useRoutingStrategies();
  const createMutation = useCreateRoutingStrategy();
  const updateMutation = useUpdateRoutingStrategy();
  const reorderMutation = useReorderRoutingStrategies();

  // Sync local state with query data
  React.useEffect(() => {
    setLocalStrategies(strategies);
  }, [strategies]);

  const handleCreate = () => {
    setEditingStrategy(undefined);
    setDrawerVisible(true);
  };

  const handleEdit = (strategy: RoutingStrategy) => {
    setEditingStrategy(strategy);
    setDrawerVisible(true);
  };

  const handleToggle = (strategy: RoutingStrategy) => {
    const newEnabled = !strategy.enabled;
    Modal.confirm({
      title: `${newEnabled ? 'Enable' : 'Disable'} Strategy`,
      content: `Are you sure you want to ${newEnabled ? 'enable' : 'disable'} "${strategy.name}"?`,
      onOk: async () => {
        try {
          await updateMutation.mutateAsync({ 
            id: strategy.id, 
            payload: { enabled: newEnabled } 
          });
          message.success(`Strategy ${newEnabled ? 'enabled' : 'disabled'} successfully`);
        } catch {
          message.error('Failed to update strategy');
        }
      },
    });
  };

  const handleSubmit = async (values: Partial<RoutingStrategy>) => {
    try {
      if (editingStrategy) {
        await updateMutation.mutateAsync({ id: editingStrategy.id, payload: values });
        message.success('Strategy updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Strategy created successfully');
      }
      setDrawerVisible(false);
    } catch {
      message.error(editingStrategy ? 'Failed to update strategy' : 'Failed to create strategy');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localStrategies.findIndex(s => s.id === active.id);
    const newIndex = localStrategies.findIndex(s => s.id === over.id);

    const newStrategies = [...localStrategies];
    const [moved] = newStrategies.splice(oldIndex, 1);
    newStrategies.splice(newIndex, 0, moved);

    // Update priorities
    const updatedStrategies = newStrategies.map((s, idx) => ({
      ...s,
      priority: idx + 1,
    }));

    setLocalStrategies(updatedStrategies);
    setHasOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    try {
      const orderedIds = localStrategies.map(s => s.id);
      await reorderMutation.mutateAsync(orderedIds);
      message.success('Priority order saved successfully');
      setHasOrderChanged(false);
    } catch {
      message.error('Failed to save priority order');
    }
  };

  const columns: ColumnsType<RoutingStrategy> = [
    {
      title: '',
      key: 'drag',
      width: 50,
      render: () => <DragOutlined />,
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'default'}>{enabled ? 'Enabled' : 'Disabled'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: RoutingStrategy) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="text"
            danger={record.enabled}
            onClick={() => handleToggle(record)}
          >
            {record.enabled ? 'Disable' : 'Enable'}
          </Button>
        </Space>
      ),
    },
  ];

  const isMutating = createMutation.isPending || updateMutation.isPending || reorderMutation.isPending;

  return (
    <div>
      <PageHeader title="Routing Strategies" />
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Strategy
          </Button>
          {hasOrderChanged && (
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSaveOrder}
              loading={reorderMutation.isPending}
            >
              Save Priority Order
            </Button>
          )}
        </Space>

        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={localStrategies}
            loading={isLoading}
            pagination={false}
            components={{
              body: {
                row: (props: React.HTMLAttributes<HTMLTableRowElement> & { 'data-row-key': string }) => {
                  const index = localStrategies.findIndex(s => s.id === props['data-row-key']);
                  return (
                    <DraggableRow
                      {...props}
                      record={localStrategies[index]}
                      index={index}
                      moveRow={() => {}}
                    />
                  );
                },
              },
            }}
          />
        </DndContext>
      </Card>

      <Drawer
        title={editingStrategy ? 'Edit Strategy' : 'Create Strategy'}
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
      >
        <RoutingStrategyForm
          initialValues={editingStrategy}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerVisible(false)}
          loading={isMutating}
        />
      </Drawer>
    </div>
  );
}
