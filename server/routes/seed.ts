import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// POST /api/seed - 插入种子数据（开发用）
router.post('/', async (_req: Request, res: Response) => {
  // 创建一个系统用户作为任务发布者
  const systemEmail = 'system@jiyouzhongbao.app';
  
  // 检查是否已有种子数据
  const { data: existingTasks } = await supabase.from('tasks').select('id').limit(1);
  if (existingTasks && existingTasks.length > 0) {
    res.json({ message: '种子数据已存在，跳过' });
    return;
  }

  // 创建示例用户
  const demoUsers = [
    { email: 'alexchen@jiyouzhongbao.app', password: 'demo123456', username: 'Alex Chen', phone: '13800001111', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPNAKCnSrhoO6wLR9rdeCPJLywCUDPtppIsEibYPMDdZ9g6A2eyQSTL8g4wIh6maRD1x-evh9Ydv3F_ynGQY7_o9kdpupiyD-dgWO_pg-AhLO9VPhypo6x0ZBefwmmuvR_3czRPey4WthF_8VEZMnVJgVEwQmbvAb0Y9Meqqk69Erv0alP5v_1ScqIR1dYYHG3zmIMXS2XoB8gKnQZU2LetAbosmF-ESZEDNXMn61R2LXsr7jGf4Y89x3_A3AHpFAMtU5CobGE7I', rating: 4.9, task_count: 124 },
    { email: 'sarahsmith@jiyouzhongbao.app', password: 'demo123456', username: 'Sarah Smith', phone: '13800002222', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANzdxCLlKNAf2xoyd5wqizafd0EKd9DAePfTnCi4CMng_XcEG1_crkqvPLmMBfe3f-lun2_aYmW_4yjNYINvgmPRQruDhxJ3_5gtCRGs7QyRuZkRKAnVxAtafJuPEU5XF3MiQan9oYYTNZg_Mg6Z_k8TTvw1uW_XVfEBWe7OPuOU42ZkJhN4UbExySTj4Jw_vR7xiMv5I2ny5Cu4-lgn_4V-uEaP1LMJ3mpLhEOUT2U_Z6BL9nkSjNDI1CR7RvWERhCSu5Fr4Jh0k', rating: 4.8, task_count: 56 },
    { email: 'davidlee@jiyouzhongbao.app', password: 'demo123456', username: 'David Lee', phone: '13800003333', avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHltP9wxDP418s_LyOlrgfIhO6bECzDCvjoTVpISiDLdQIR1YUUMxUoiVhkzagLkF13bEdMM68tR4RigR-RG7CnQoa-m7JCX9JLv0lmdhKXP9Np2ZjbXxKrUiV5B0ZjmcpR-e7kS1Jmk5qipVKEUSj4UTKNO0NyogiQhqg2ppoP9F5e9GCfyP-rPbV_e5CROBBzo4M2gseA7kAohDHG9e8dru7fI3qjYqUEBlxkh744hbpsc7_mfTGDiqCNCQD1i5XkZTAz-lcj6o', rating: 5.0, task_count: 12 },
  ];

  const userIds: string[] = [];

  for (const user of demoUsers) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      // 如果用户已存在，尝试获取
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = (existingUsers?.users || []).find((u: any) => u.email === user.email);
      if (existing) {
        userIds.push(existing.id);
        continue;
      }
      console.error('Failed to create user:', authError.message);
      continue;
    }

    const userId = authData.user.id;
    userIds.push(userId);

    await supabase.from('profiles').upsert({
      id: userId,
      username: user.username,
      phone: user.phone,
      avatar_url: user.avatar_url,
      rating: user.rating,
      task_count: user.task_count,
      role: 'employer',
    });

    await supabase.from('wallets').upsert({
      user_id: userId,
      balance: Math.random() * 5000,
      total_earnings: Math.random() * 10000,
      frozen_funds: Math.random() * 500,
    });
  }

  // 插入示例任务
  if (userIds.length >= 3) {
    const tasks = [
      {
        title: '科技初创公司简约 Logo 设计',
        description: '为一个新的 AI 平台寻找简洁、现代的几何图形 Logo。需要在深色背景下表现良好...',
        budget: 150,
        distance: '1.2km',
        time_left: '4小时',
        category: '设计',
        status: 'urgent',
        delegator_id: userIds[0],
        location: '西雅图，市中心',
        date: '2023年10月24日',
      },
      {
        title: '取洗好的衣物并代购有机食品',
        description: '前往当地洗衣店取件，然后去健康食品店。接受任务后将提供详细清单。',
        budget: 45,
        distance: '0.5km',
        time_left: '今日下午 6点',
        category: '跑腿',
        status: 'new',
        delegator_id: userIds[1],
        location: '西雅图，国会山',
        date: '2023年10月25日',
      },
      {
        title: '高级 Python 辅导 - 数据可视化',
        description: '寻找 2 小时的辅导，帮助掌握 Matplotlib 和 Seaborn 以完成大学期末项目。',
        budget: 120,
        distance: '2.5km',
        category: '家教',
        status: 'high-reward',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo-V8HUyCiOSWG9OQqd1-r8r0Q2FY5p9_ZDN9tYT21AncVwCF_Q5RIY9MOctiBSTIsi-SH5P3vowpyKNIMRbyGaPXh1hslagDUQE0GQkD2G46QSEj6zm1nCXlxR5Pc8HU60EoPcvB0E-wC1A-alOZP2DctLvixcwTCM-W5CD_sNy3WLP0FCF2DXu4oP3_llyxyzDtf1h8n3YZnxE_83gY6Ipw8neq8loEml0Ye3tTucTwVQ7SxO53YtLN8AU-T9aI-jqcBJxd8w9U',
        delegator_id: userIds[2],
        location: '华盛顿大学',
        date: '2023年10月26日',
      },
    ];

    for (const task of tasks) {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

      if (taskError) {
        console.error('Failed to insert task:', taskError.message);
        continue;
      }

      // 为第一个任务添加附件
      if (task.title.includes('Logo')) {
        await supabase.from('task_attachments').insert([
          { task_id: taskData.id, name: '阁楼内部', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6FuBDthje5bvi9JmoLlwJUCFVmnV1j5VUfU3aIKzNECNxg_WfY8KuDcyOFSP1afvbshasbcyDdx8_67e0KKMCERxEUOBlYBz0pwSA7eu_S3tqEnPks4pxzsIpY4Z0hniencQQnZnzaMUEZGBdRGQc4flTfdas6dfyAlX85naa5hbKOMMngSBXnizeeviMzYGVb7ZUIJQbp33IBg7p9vAjaLHq5BwEQEa84nXt5eJV4FgyfMP0CZn11zmjCourxE91lgXxzKKfOs', type: 'image' },
          { task_id: taskData.id, name: '厨房区域', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjAny1E0-AfqAVZE8o1LaFQBzjI73PvCov3x8v2cDixdRx8BvFshb8SOcQ6fBHRq73x9REErzvoeFOkMv5F-2vhOnJFhlyBf4uCBdstOoQfxl3Zsva0h3rFGDkgRDYWMQZOvPVPMcyB4dAemMtnUBmo3kSiTiyEUJKz2woAMDTL0QpflzwsEARaZPmktqc9TSekUpQFQKnA2wEpd9CK35FVPdJIxzN1fV8AMbNxB859SMCVFTQ9GlQeQyhCFiT3NG0sz5CklCuJPk', type: 'image' },
          { task_id: taskData.id, name: '平面图', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH1SQ-seLVFAPCRJzAvtR_Swj1lOP7STKUEGg0kFlyDG7B5uAgo_kJdaVXbJjtA81eUhg9_ld-7dxlOCIqwvsIAySugZeln1yUyryFrAdauqbT4CLc31wwHLEtZGWHPWAzGSsgZPCWXkL4YLm0_eITqdsqG4awYBJGze129k2twz2vZ-Fn8TzId3Ojcr15SHgRLrpkIsZPjD_8O_HWYvdVmNjblhRjbVl0QPLvHjQelnUTlTIFrXDfHizYftHCXbph-506MaJjEms', type: 'image' },
        ]);
      }
    }

    // 插入示例消息（发给所有新注册用户的系统消息）
    // 这些消息将在用户注册时关联
  }

  res.json({ message: '种子数据插入成功', userCount: userIds.length });
});

export default router;
