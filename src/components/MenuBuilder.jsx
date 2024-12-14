import React, { useState } from 'react';
import { Tree, Input, Button, Modal } from 'antd';
import './MenuBuilder.css';

const MenuBuilder = () => {
  const [treeData, setTreeData] = useState([
    {
      title: 'Category 1',
      key: '0-0',
      children: [
        { title: 'Subcategory 1', key: '0-0-0' },
        { title: 'Subcategory 2', key: '0-0-1' },
      ],
    },
  ]);

  const [editingNode, setEditingNode] = useState(null);
  const [nodeTitle, setNodeTitle] = useState('');

  const addNode = (parentKey) => {
    const newNode = {
      title: 'New Node',
      key: `${parentKey}-${Date.now()}`,
    };
    const newData = [...treeData];
    const parentNode = findNodeByKey(newData, parentKey);
    parentNode.children = [...(parentNode.children || []), newNode];
    setTreeData(newData);
  };

  const editNode = (node) => {
    setEditingNode(node);
    setNodeTitle(node.title);
  };

  const saveNode = () => {
    if (!editingNode) return;
    const newData = [...treeData];
    const node = findNodeByKey(newData, editingNode.key);
    node.title = nodeTitle;
    setTreeData(newData);
    setEditingNode(null);
    setNodeTitle('');
  };

  const deleteNode = (node) => {
    const newData = [...treeData];
    const parentNode = findParentNode(newData, node.key);
    if (parentNode) {
      parentNode.children = parentNode.children.filter((child) => child.key !== node.key);
      setTreeData(newData);
    }
  };

  const findNodeByKey = (data, key) => {
    for (let node of data) {
      if (node.key === key) {
        return node;
      } else if (node.children) {
        const result = findNodeByKey(node.children, key);
        if (result) return result;
      }
    }
    return null;
  };

  const findParentNode = (data, key) => {
    for (let node of data) {
      if (node.children) {
        if (node.children.find((child) => child.key === key)) {
          return node;
        } else {
          const result = findParentNode(node.children, key);
          if (result) return result;
        }
      }
    }
    return null;
  };

  const onNodeDrop = (info) => {
    const newData = [...treeData];
    const dragNode = findNodeByKey(newData, info.dragNode.key);
    const dropNode = findNodeByKey(newData, info.node.key);
    if (dragNode && dropNode) {
      const dragParentNode = findParentNode(newData, dragNode.key);
      dragParentNode.children = dragParentNode.children.filter(
        (child) => child.key !== dragNode.key
      );
      dropNode.children = dropNode.children || [];
      dropNode.children.push(dragNode);
      setTreeData(newData);
    }
  };

  return (
    <div className="menu-builder-container">
      <div className="menu-builder-header">
        <h2>Menu Builder</h2>
        <Button className="add-category-button" onClick={() => addNode('0-0')}>
          Add Category
        </Button>
      </div>
      <Tree
        draggable
        treeData={treeData}
        onDrop={onNodeDrop}
        titleRender={(node) => (
          <div>
            <span>{node.title}</span>
            <div className="tree-node-buttons">
              <Button onClick={() => editNode(node)} size="small">
                Edit
              </Button>
              <Button onClick={() => deleteNode(node)} size="small" danger>
                Delete
              </Button>
            </div>
          </div>
        )}
      />
      <Modal
        title="Edit Node"
        visible={editingNode !== null}
        onCancel={() => setEditingNode(null)}
        onOk={saveNode}
      >
        <Input
          className="modal-input"
          value={nodeTitle}
          onChange={(e) => setNodeTitle(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default MenuBuilder;
