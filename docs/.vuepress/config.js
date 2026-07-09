import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'zh-CN',

  base:'/MyNotes/',
  title: 'MyNotes',
  description: 'Notes',

  theme: defaultTheme({
    logo: '/images/IMG_20220831_203032.jpg',

    navbar: [
      '/',
      {
        text: '初入测试',
        children: [
          {
            text: '工具类',
            link: '/tools/git.md',
          },
          {
            text: '测试领域',
            link: '/testing/test-process.md',
          },
          {
            text: '汽车领域',
            link: '/automotive/can-bus.md',
          },
          {
            text: '杂项',
            link: '/misc/company-intro.md',
          },
        ],
      },
    ],

    sidebar: {
      '/tools/': [
        {
          text: '工具类',
          collapsible: true,
          children: [
            '/tools/git.md',
            '/tools/jira.md',
            '/tools/xmind.md',
            '/tools/postman.md',
          ],
        },
      ],
      '/testing/': [
        {
          text: '测试领域',
          collapsible: true,
          children: [
            '/testing/test-process.md',
            '/testing/test-design.md',
            '/testing/bug-management.md',
            '/testing/test-report.md',
          ],
        },
      ],
      '/automotive/': [
        {
          text: '汽车领域',
          collapsible: true,
          children: [
            '/automotive/can-bus.md',
            '/automotive/capl-basics.md',
            '/automotive/diagnostic-protocol.md',
          ],
        },
      ],
      '/misc/': [
        {
          text: '杂项',
          collapsible: true,
          children: [
            '/misc/company-intro.md',
            '/misc/onboarding-notes.md',
          ],
        },
      ],
    },
  }),

  bundler: viteBundler(),
})
