import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Lovi出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'user_center_project',
          title: '用户中心项目',
          href: 'https://gitee.com/shenqing0202/my-user-center.git',
          blankTarget: true,/*点击链接在新标签打开*/
        },
        {
          key: 'gitee',
          title: <GithubOutlined />,
          href: 'https://gitee.com/shenqing0202/my-user-center.git',
          blankTarget: true,
        },
        {
          key: 'Lovi_center',
          title: 'lovi_user_center',
          href: 'https://gitee.com/shenqing0202/my-user-center.git',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
