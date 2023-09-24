import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { RequestConfig } from '@@/plugin-request/request';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';
const WHITE_LIST = [loginPath, registerPath];

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
//设置请求超时时间
export const request: RequestConfig = {
  timeout: 1000000 /*100秒超时*/,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 获取当前的状态，
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // 获取当前用户信息（配和全局响应封装版本）
  const fetchUserInfo = async () => {
    try {
      const user = await queryCurrentUser();
      console.log('获取当前用户接口的res==>' + JSON.stringify(user, null, 2));
      if (user != null) {
        // alert("成功获取到curentUser")
        return user;
      } else {
        //错误
        // alert("没获取到crentUser！所以去登录页面！")
        history.push(loginPath); //回到登录页面
        return undefined;
      }
    } catch (error) {
      //发现没有用户的信息的时候就跳转去登录页面
      history.push(loginPath);
    }
    return undefined;
  };
  //原版
  // const fetchUserInfo = async () => {
  //   try {
  //     const user = await queryCurrentUser();
  //     console.log("获取当前用户接口的user==>" + JSON.stringify(user, null, 2));
  //     return user;
  //   } catch (error) {
  //     //发现没有用户的信息的时候就跳转去登录页面
  //     history.push(loginPath);
  //   }
  //   return undefined;
  // };
  // 如果不是白名单页面(登录/注册)
  if (!WHITE_LIST.includes(history.location.pathname)) {
    //那就要获取当前登录用户信息
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      /*水印*/
      content: initialState?.currentUser?.userAccount,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      //如果是白名单的页面直接返回，不做多余操作
      if (WHITE_LIST.includes(location.pathname)) {
        return;
      }
      // 如果不是白名单且没有登录，重定向到 login
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
