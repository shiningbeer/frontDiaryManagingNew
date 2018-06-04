
import React, { PureComponent } from 'react';
import { message,Upload,Card,Icon} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const Dragger = Upload.Dragger;

export default class NewPlugin extends PureComponent {

  render() {
    const props = {
      name: 'file',
      multiple: true,
      action: 'http://localhost:1978/plugin/add',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <PageHeaderLayout title="插件管理" content="本工具只支持python所写的插件。">
        <Card bordered={false}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
        </Dragger>
        </Card>
      </PageHeaderLayout>
    );
  }
}
