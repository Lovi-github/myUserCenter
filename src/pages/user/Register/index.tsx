import Footer from '@/components/Footer';
import { register} from '@/services/ant-design-pro/api';
import {/*这些都是图标常量logo那些*/
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {  message, Tabs } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from 'umi';
import styles from './index.less';
import { SYSTEM_LOGO } from "@/constant";



const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const intl = useIntl();


  // 提交按钮处理
  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      //先校验
      const {password ,checkPassword} = values
      if (password!=checkPassword){
        message.error("两次密码输入不一致！")
        return;
      }
      // 注册
      const id = await register({ ...values, type }); //返回值为id
        //当id > 0 说明就是后端注册成功嘛
      if (id > 0) {
        const defaultRegisterSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultRegisterSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        /*如果redirect有值,就跳转到它指定的页面
        如果redirect为空,就跳转到首页'/'*/
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultRegisterFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: '注册失败，请重试！',
      });
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src= {SYSTEM_LOGO} />}
          title="Lovi User Center"
          subTitle="用户中心--注册页面"
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig:{
              submitText: "注册"
            }
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountRegister.tab',
                /*修改没有生效居然*/
                defaultMessage: '账号密码注册',
              })}
            />
          </Tabs>


          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.userAccount.placeholder',
                  defaultMessage: '请输入账号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.userAccount.required"
                        defaultMessage="请输入账号!"
                      />
                    ),
                  },
                ]}
              />
              {/*  加一些密码校验，密码长度不能小于8位*/}
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password1.placeholder',
                  defaultMessage: '请输入密码 ',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },{
                  type: "string",
                  min: 8,
                  message: "密码不能小于8位！！"
                  }

                ]}
              />
              {/*增加确认密码框*/}
              <ProFormText.Password
                  name="checkPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.checkPassword.placeholder',
                    defaultMessage: '请再次输入密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                          <FormattedMessage
                              id="pages.login.password.required"
                              defaultMessage="请输入密码！"
                          />
                      ),
                    },{
                      type: "string",
                      min: 8,
                      message: "密码不能小于8位！！"
                    }

                  ]}
              />
            </>
          )}

        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
