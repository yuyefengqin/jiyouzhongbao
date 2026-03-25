import { Task, Transaction, Message } from './types';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: '科技初创公司简约 Logo 设计',
    description: '为一个新的 AI 平台寻找简洁、现代的几何图形 Logo。需要在深色背景下表现良好...',
    budget: 150,
    distance: '1.2km',
    timeLeft: '4小时',
    category: '设计',
    status: 'urgent',
    delegator: {
      name: 'Alex Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPNAKCnSrhoO6wLR9rdeCPJLywCUDPtppIsEibYPMDdZ9g6A2eyQSTL8g4wIh6maRD1x-evh9Ydv3F_ynGQY7_o9kdpupiyD-dgWO_pg-AhLO9VPhypo6x0ZBefwmmuvR_3czRPey4WthF_8VEZMnVJgVEwQmbvAb0Y9Meqqk69Erv0alP5v_1ScqIR1dYYHG3zmIMXS2XoB8gKnQZU2LetAbosmF-ESZEDNXMn61R2LXsr7jGf4Y89x3_A3AHpFAMtU5CobGE7I',
      rating: 4.9,
      taskCount: 124
    },
    location: '西雅图，市中心',
    date: '2023年10月24日',
    attachments: [
      { name: '阁楼内部', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6FuBDthje5bvi9JmoLlwJUCFVmnV1j5VUfU3aIKzNECNxg_WfY8KuDcyOFSP1afvbshasbcyDdx8_67e0KKMCERxEUOBlYBz0pwSA7eu_S3tqEnPks4pxzsIpY4Z0hniencQQnZnzaMUEZGBdRGQc4flTfdas6dfyAlX85naa5hbKOMMngSBXnizeeviMzYGVb7ZUIJQbp33IBg7p9vAjaLHq5BwEQEa84nXt5eJV4FgyfMP0CZn11zmjCourxE91lgXxzKKfOs', type: 'image' },
      { name: '厨房区域', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjAny1E0-AfqAVZE8o1LaFQBzjI73PvCov3x8v2cDixdRx8BvFshb8SOcQ6fBHRq73x9REErzvoeFOkMv5F-2vhOnJFhlyBf4uCBdstOoQfxl3Zsva0h3rFGDkgRDYWMQZOvPVPMcyB4dAemMtnUBmo3kSiTiyEUJKz2woAMDTL0QpflzwsEARaZPmktqc9TSekUpQFQKnA2wEpd9CK35FVPdJIxzN1fV8AMbNxB859SMCVFTQ9GlQeQyhCFiT3NG0sz5CklCuJPk', type: 'image' },
      { name: '平面图', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1SQ-seLVFAPCRJzAvtR_Swj1lOP7STKUEGg0kFlyDG7B5uAgo_kJdaVXbJjtA81eUhg9_ld-7dxlOCIqwvsIAySugZeln1yUyryFrAdauqbT4CLc31wwHLEtZGWHPWAzGSsgZPCWXkL4YLm0_eITqdsqG4awYBJGze129k2twz2vZ-Fn8TzId3Ojcr15SHgRLrpkIsZPjD_8O_HWYvdVmNjblhRjbVl0QPLvHjQelnUTlTIFrXDfHizYftHCXbph-506MaJjEms', type: 'image' }
    ]
  },
  {
    id: '2',
    title: '取洗好的衣物并代购有机食品',
    description: '前往当地洗衣店取件，然后去健康食品店。接受任务后将提供详细清单。',
    budget: 45,
    distance: '0.5km',
    timeLeft: '今日下午 6点',
    category: '跑腿',
    status: 'new',
    delegator: {
      name: 'Sarah Smith',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANzdxCLlKNAf2xoyd5wqizafd0EKd9DAePfTnCi4CMng_XcEG1_crkqvPLmMBfe3f-lun2_aYmW_4yjNYINvgmPRQruDhxJ3_5gtCRGs7QyRuZkRKAnVxAtafJuPEU5XF3MiQan9oYYTNZg_Mg6Z_k8TTvw1uW_XVfEBWe7OPuOU42ZkJhN4UbExySTj4Jw_vR7xiMv5I2ny5Cu4-lgn_4V-uEaP1LMJ3mpLhEOUT2U_Z6BL9nkSjNDI1CR7RvWERhCSu5Fr4Jh0k',
      rating: 4.8,
      taskCount: 56
    },
    location: '西雅图，国会山',
    date: '2023年10月25日',
    attachments: []
  },
  {
    id: '3',
    title: '高级 Python 辅导 - 数据可视化',
    description: '寻找 2 小时的辅导，帮助掌握 Matplotlib 和 Seaborn 以完成大学期末项目。',
    budget: 120,
    distance: '2.5km',
    category: '家教',
    status: 'high-reward',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo-V8HUyCiOSWG9OQqd1-r8r0Q2FY5p9_ZDN9tYT21AncVwCF_Q5RIY9MOctiBSTIsi-SH5P3vowpyKNIMRbyGaPXh1hslagDUQE0GQkD2G46QSEj6zm1nCXlxR5Pc8HU60EoPcvB0E-wC1A-alOZP2DctLvixcwTCM-W5CD_sNy3WLP0FCF2DXu4oP3_llyxyzDtf1h8n3YZnxE_83gY6Ipw8neq8loEml0Ye3tTucTwVQ7SxO53YtLN8AU-T9aI-jqcBJxd8w9U',
    delegator: {
      name: 'David Lee',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHltP9wxDP418s_LyOlrgfIhO6bECzDCvjoTVpISiDLdQIR1YUUMxUoiVhkzagLkF13bEdMM68tR4RigR-RG7CnQoa-m7JCX9JLv0lmdhKXP9Np2ZjbXxKrUiV5B0ZjmcpR-e7kS1Jmk5qipVKEUSj4UTKNO0NyogiQhqg2ppoP9F5e9GCfyP-rPbV_e5CROBBzo4M2gseA7kAohDHG9e8dru7fI3qjYqUEBlxkh744hbpsc7_mfTGDiqCNCQD1i5XkZTAz-lcj6o',
      rating: 5.0,
      taskCount: 12
    },
    location: '华盛顿大学',
    date: '2023年10月26日',
    attachments: []
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: '数据标注任务', amount: 45.00, date: '今天, 2:45 PM', type: 'income', status: '已收入' },
  { id: '2', title: '平台服务费', amount: -2.25, date: '昨天', type: 'expense', status: '已扣除' },
  { id: '3', title: '发布任务押金', amount: -150.00, date: '10月12日, 11:20 AM', type: 'expense', status: '已支付' },
  { id: '4', title: '图片核验', amount: 12.50, date: '10月11日, 4:10 PM', type: 'income', status: '已收入' }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: { name: '系统助手', avatar: '', role: 'system' },
    content: '您的“同城快递代送”任务已通过审核，点击查看详情。',
    time: '10:45',
    unreadCount: 2
  },
  {
    id: '2',
    sender: { name: '张伟 (雇主)', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHltP9wxDP418s_LyOlrgfIhO6bECzDCvjoTVpISiDLdQIR1YUUMxUoiVhkzagLkF13bEdMM68tR4RigR-RG7CnQoa-m7JCX9JLv0lmdhKXP9Np2ZjbXxKrUiV5B0ZjmcpR-e7kS1Jmk5qipVKEUSj4UTKNO0NyogiQhqg2ppoP9F5e9GCfyP-rPbV_e5CROBBzo4M2gseA7kAohDHG9e8dru7fI3qjYqUEBlxkh744hbpsc7_mfTGDiqCNCQD1i5XkZTAz-lcj6o', role: 'employer' },
    content: '好的，这些修改建议非常专业，期待下一稿。',
    time: '09:12',
    unreadCount: 1,
    taskTitle: '网页UI图标设计',
    status: 'ongoing'
  },
  {
    id: '3',
    sender: { name: '李明 (服务商)', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTOu2DCozPGp7IbBnB2hQMHD1F2h5YU-E3TPwzF5dq2pzJFfgd1iifpbM3_Kuv502p1kIgs1n-Wsn0SgRrMpz_QpDHdg-pk-kDIL13u89niORSdRN3nonduiCoAMPIPcC33uD510nLv3oA9HDfLWRP_D9NDzOaX2Z1nC5DURnbbTSf2hunaLY_q2NELEADmXFydNbtSvpcdbPK2XiFh9xyrsq1HyrUPy9qPxRhN7NPzCPVSYoLdxnxmTPM9j3ldcItsLp-dDIq6Oc', role: 'provider' },
    content: '合同第二页的条款我已经根据您的要求重新整理了...',
    time: '昨天',
    taskTitle: '法律文档校对'
  },
  {
    id: '4',
    sender: { name: '陈思思 (雇主)', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcnNuNjSmt5xYy0D5sRg7o7pu7Dalkf5V_JwhimlsBf_lwBoGCFE2Sf8AfGPa7OKELqKQ3yiI8b5vfxCExj9hhku6FMJZKAC8H3SAzJdi9aEIPhj6vFn1seTZbEhNXCYMQFa63-SBfgYo_gI0eisxqRaLWsfE7ljVulMDu9Gs3L4QE26ch1XmI-1_HCxyUDsSu1iO-zlKAr9Fa4ooxdz1pFMSdPQWs3ePnh15Cjzddb_DG3UrmDjyE1RAfyFXapRphBzihT757BZ0', role: 'employer' },
    content: '合作愉快，希望下次还有机会合作！',
    time: '周三',
    taskTitle: '翻译志愿者',
    status: 'completed'
  }
];
