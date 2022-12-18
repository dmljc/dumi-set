---
toc: content
order: 1
---

# Git

## 全能图

![](https://t1.picb.cc/uploads/2019/09/09/gXSUxe.jpg)

## 创建分支

```js
// 创建并切换分支
git checkout -b feature1
```

## stash

`stash` 用于临时保存工作目录的改动。开发中可能会遇到代码写一半需要切分支打包的问题，如果这时候你不想 `commit` 的话，就可以使用该命令。

<h3>储藏操作：</h3>

```js
git stash

// 或者你想给 stash 填写储藏信息可以使用 save，类似填写 commit 信息

git stash save -u 'message'
```

<Alert type='info'>
没有被 track 的文件 不会被 stash 起来，因为 Git 会忽略它们。如果想把这些文件也一起 stash，可以加上 `-u` 参数，它是 `--include-untracked` 的简写。
</Alert>

<h3>查看现有 stash </h3>

```js
git stash list
git stash show // 显示做了哪些改动，默认show 第一个存储。
git stash show stash@{1} // 显示第二个存储
git stash show stash@{1} -p // 显示第二个存储的具体改动
```

<h3>取出应用：</h3>

```js
git stash pop       // 取出最近一次暂存并删除记录列表中对应记录
git stash pop stash@{1}  // 取出制定某次（第二次）暂存并删除记录列表中对应记录

git stash apply  // 取出最近一次暂存，但是不会删除列表中对应记录
git stash apply stash@{1} // 取出制定某次（第二次）暂存，但是不会删除列表中对应记录
```

这样你之前临时保存的代码又回来了。

<h3>移除 stash </h3>

```js
git stash drop  // 从记录列表中删除最近一次暂存
git stash drop stash@{1} // 从记录列表中删除制定某次（第二次）暂存

git stash clear // 删除所有缓存的stash
```

## reset

HEAD 指向的版本就是当前版本，因此，Git 允许我们在版本的历史之间穿梭

如果想恢复到之前某个提交的版本，且那个版本之后提交的版本我们都不要了，就可以用这种方法。

```js
// 撤销最新的 commit
git reset --hard HEAD^

// 撤销指定的 commit
git reset --hard commit_id

// 穿梭前，用git log可以查看提交历史，以便确定要回退到哪个版本。
// 要重返未来，用git reflog查看命令历史，以便确定要回到未来的哪个版本。
```

但是 `reset` 的本质并不是删除了 commit，而是重新设置了 HEAD 和它指向的 branch。

## revert

revert 同 reset 操作：如果我们想撤销之前的某一版本，但是又想保留该目标版本后面的版本，
记录下这整个版本变动流程，就可以用这种方法。

## commit 未 push

如果在未 push 之前想修改 commit 可以采用 amend 「修正」

```js
// 修改最新的 commit 信息
git commit --amend

// 修改指定的 commit 修改
git rebase -i commit_id  // 父级commit_id

// 然后，跳出 vim 界面
pick be12bef 我是修改之前的倒数第二个 commit 信息
pick bf232ne 我是修改之前的倒数第一个 commit 信息

// 假如我想修改倒数第一个的 commit 信息
把pick 改成r    （reword commit）

// 回报错 error: failed to push some refs to 'github.com:dmljc/umi4-admin.git

git pull --rebase origin main // Successfully rebased and updated refs/heads/main.表示成功
```

修改完之后，点击 esc :wq 保存退出。

## commit 已 push

git 修改已经 push 过的 commit 信息：

```js
git rebase -i HEAD~3  // HEAD~3表示最近的3个提交记录

// pick be61698 feat:根据登录返回的authoration，完善请求头token和登录逻辑
// pick ddeac42 feat:优化和退出登录
// pick b24126e feat: 20221218 14:17:33update

// 找到需要修改的commit，按i进入编辑模式，修改前面的pick为edit，然后ESC、:wq保存并退出。（注意：此时还不用修改message）

git commit --amend  // 修改制定 commit

git rebase --continue // 继续执行

// 当出现：Successfully rebased and updated refs/heads/main. 则表示修改成功，

git push -f // 强制推送到远程即可
```

## checkout

checkout 除了切换分支，还可以把未 add 的本地修改撤销

```js
git checkout 目标文件

// 撤销本地全部的修改
git checkout .
```

## cherry pick

摘取指定的 commit 信息并应用到目标分支。

```js
git cherry-pick commit _id1 // 单个commit
git cherry-pick commit _id1 commit _id2 ... // 多个commit
```

## tag

```js
git tag 						// 查看所有tag
git tag -l 'v1.3*'				// -l 命令使用通配符来过滤tag

git tag tagName 				// 创建tag
git tag -a tagName -m 'XXX'		// 创建tag的同时添加tag的commit信息 =======》很重要

git push origin tagName			// 把tag推送到远端
git push origin —tags			// 推送本地所有tag到远端

git show tagName				// 查看某个tag的详细信息

git tag tagName commitID				// 为历史版本添加tag(方式一)
git tag -a tagName commitID -m 'XXX'    // 为历史版本添加tag（方式二）

git tag -d tagName  					// 删除本地tag
git push origin —delete tagName			// 删除远端tag（方式一）
git push origin :refs/tags/tagName		// 删除远端tag（方式二)
```

## rebase

该命令可以让和 `merge` 命令得到的结果基本是一致的。

通常使用 `merge` 操作将分支上的代码合并到 `master` 中，分支样子如下所示

![](https://t1.picb.cc/uploads/2019/09/09/gXjARg.md.png)

使用 `rebase` 后，会将 `develop` 上的 `commit` 按顺序移到 `master` 的第三个 `commit` 后面，分支样子如下所示

![](https://t1.picb.cc/uploads/2019/09/09/gXp4ST.png)

使用 rebase 应该在需要被 rebase 的分支上操作，并且该分支是本地分支。如果 `develop` 分支需要 rebase 到 `master` 上去，那么应该如下操作

```js
// current branch develop
git rebase master

git checkout master
// 用于将 master 上的 HEAD 移动到最新的 commit
git merge develop
```

`rebase` 对比 `merge`，优势在于`合并后的结果很清晰`，只有一条线，劣势在于如果一旦出现冲突，`解决冲突很麻烦`，可能要解决多个冲突，但是 `merge` 出现`冲突只需要解决一次`。
