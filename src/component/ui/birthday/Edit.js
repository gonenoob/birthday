import { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Modal, message, Input, InputNumber, Icon, Form, Radio } from 'antd'
import { ipcRenderer } from 'electron'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

@Form.create()
export default class Edit extends Component {
  constructor(props) {
    super(props)
  }

  handleSubmit() {
    const { validateFields } = this.props.form

    validateFields((err, values) => {
      if (err) {
        return
      }
      const isEdit = this.props.type === 'edit'
      let channel = 'birthday-add'
      let typeWords = '添加'

      if (isEdit) {
        values.id = this.props.data.id
        channel = 'birthday-edit'
        typeWords = '编辑'
      }

      let data = ipcRenderer.sendSync(channel, values)
      if (data.success) {
        message.success(`${typeWords}成功`)

        if (this.props.callback) {
          this.props.callback()
        }
        this.props.hideModal()
      } else {
        message.error(data.msg)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    const isEdit = data ? true : false
    
    return (
      <Modal 
        visible={ this.props.show }
        title={ isEdit ? '编辑生日' : '添加生日' }
        onCancel={ this.props.hideModal }
        onOk={ this.handleSubmit.bind(this) }
        destroyOnClose={true}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="昵称"
            >
              {
                getFieldDecorator('name', {
                  initialValue: isEdit ? data.name : undefined,
                  rules: [{
                    required: true,
                    message: '请填写昵称'
                  }]
                })(
                  <Input style={{ width: '60%' }} maxLength="10"/>
                )
              }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类型"
          >
            {
              getFieldDecorator('type', {
                initialValue: isEdit ? data.type : undefined,
                rules: [{
                  required: true,
                  message: '请选择类型'
                }]
              })(
                <RadioGroup>
                  <RadioButton value="1">阴历</RadioButton>
                  <RadioButton value="2">阳历</RadioButton>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="月份"
          >
            {
              getFieldDecorator('month', {
                initialValue: isEdit ? data.month : undefined,
                rules: [{
                  required: true,
                  message: '请填写月份'
                }]
              })(
                <InputNumber min={1}  max={12}/>
              )
            }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="天数"
          >
            {
              getFieldDecorator('day', {
                initialValue: isEdit ? data.day : undefined,
                rules: [{
                  required: true,
                  message: '请填写天数'
                }]
              })(
                <InputNumber min={1}  max={31}/>
              )
            }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="出生年份"
          >
            {
              getFieldDecorator('year', {
                initialValue: isEdit ? data.year : undefined
              })(
                <InputNumber min={1800} />
              )
            }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="联系方式"
          >
            {
              getFieldDecorator('contact', {
                initialValue: isEdit ? data.contact : undefined
              })(
                <TextArea style={{ width: '60%' }} autosize={{ minRows: 2, maxRows: 6 }} />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}