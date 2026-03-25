# 2026-03-26 进度记录

## 已完成

- 已并行生成剩余 59 篇 LeetCode 博客 Markdown，文件位于 `.agents/leetcode-blog-writer/`
- 已成功发布 31 篇博客到博客园
- 已将这 31 篇全部加入 LeetCode 合集 `38522`
- 已把已发布文章的 `blogUrl` 回填到 `assets/js/problems-data.js`
- 已修复 `.agents/cnblogs-publisher/add_to_collection.py` 的超时/重试问题
- 已生成已发布链接映射文件：`.agents/cnblogs-publisher/published_links_2026-03-26.json`
- 已生成剩余待发布队列：`.agents/cnblogs-publisher/remaining_publish_queue_2026-03-26.json`

## 今日发布成功的题目

- 42, 76, 239, 84, 25, 23, 102, 98, 230, 199, 114, 105, 437, 236, 124, 200, 994, 207, 208, 46, 78
- 17, 39, 22, 79, 131, 51, 74, 34, 33, 153

对应 postid 区间：

- `19772917` 到 `19772937`
- `19772973` 到 `19772982`

## 今日阻塞

- 博客园发布接口报错：`发布失败！超出当日博文发布数量限制`
- 这不是脚本错误，是平台当天发文额度限制
- 因此剩余 28 篇未发布，需明天继续

## 明天继续发布的 28 题

- 4 寻找两个正序数组的中位数
- 198 打家劫舍
- 279 完全平方数
- 322 零钱兑换
- 139 单词拆分
- 300 最长递增子序列
- 152 乘积最大子数组
- 416 分割等和子集
- 32 最长有效括号
- 62 不同路径
- 64 最小路径和
- 5 最长回文子串
- 1143 最长公共子序列
- 72 编辑距离
- 55 跳跃游戏
- 45 跳跃游戏 II
- 763 划分字母区间
- 215 数组中的第K个最大元素
- 347 前 K 个高频元素
- 295 数据流的中位数
- 73 矩阵置零
- 54 螺旋矩阵
- 48 旋转图像
- 240 搜索二维矩阵 II
- 75 颜色分类
- 31 下一个排列
- 287 寻找重复数
- 41 缺失的第一个正数

## 关键文件

- 进度记录：`.agents/cnblogs-publisher/TEMP_PROGRESS_2026-03-26.md`
- 剩余队列：`.agents/cnblogs-publisher/remaining_publish_queue_2026-03-26.json`
- 已发布映射：`.agents/cnblogs-publisher/published_links_2026-03-26.json`
- 合集脚本：`.agents/cnblogs-publisher/add_to_collection.py`
- 题目数据：`assets/js/problems-data.js`
- playground 数据：`assets/js/playground.js`

## 明天的操作顺序

1. 读取 `remaining_publish_queue_2026-03-26.json`
2. 继续发布剩余 28 篇
3. 将新发布文章加入合集 `38522`
4. 把新增 `blogUrl` 回填到 `assets/js/problems-data.js`
5. 若 `playground.js` 里存在对应题目对象，也同步补上 `blogUrl`
