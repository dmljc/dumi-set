---
toc: content
order: 3
---

# Linux 是什么

`Linux 是服务端最流行的操作系统。`

![linux](/images/linux/linux.png)

## 文本处理

> tr、grep、look、sed、sort、spell、tr、uniq、vi、wc

### tr

将字符进行替换、压缩、删除。

格式

```js
tr[选项][参数];
```

选项

```js
-c - // 或 ——complerment：取代所有不属于第一字符集的字符；
    d - // 或——delete：删除所有属于第一字符集的字符；
    s - // 或--squeeze-repeats：把连续重复的字符以单独一个字符表示；
    t - // 或--truncate-set1：先删除第一字符集较第二字符集多出的字符。
    n; // 换行处理
```

案例

将输入字符由大写转换为小写：

```js
echo "HELLO WORLD" | tr 'A-Z' 'a-z'   // hello world
cat tr.txt | tr 'A-Z' 'a-z'
```

用-s 压缩字符，可以压缩输入中重复的字符（可以理解为去重）

```js
echo "thissss is      a text linnnnnnne." | tr -s ' sn'  // this is a text line.
cat tr.txt  | tr -s '1'  // 对字符串1做去重处理
```

使用 tr 删除字符：

```js
echo "hello 123 world 456" | tr -d '0-9' // hello  world
cat tr.txt | tr -d  '456'
```

### wc

依次统计文件的 行数、字数、字节数。

格式

```js
wc[选项][参数];
```

选项

```js
-l 或--lines             // 只显示行数。
-w 或--words             // 只显示字数。(以空格为分隔符区分的字数)
-c 或--bytes或--chars    // 只显示Bytes数（字节数）。
```

案例

```js
wc -l *                 // 统计当前目录下的所有文件(非文件夹)行数及总计行数。
wc -l *.js              // 统计当前目录下的所有 .js 后缀的文件行数及总计行数。
find  . * | xargs wc -l // 当前目录以及子目录的所有文件行数及总计行数。
```

### xargs

给命令传递参数的一个过滤器，也是组合多个命令的一个工具。

格式

```js
somecommand | xargs[选项][参数];
```

选项

```js
-n - // 多行输出
    d; // 分割输入
```

案例

```js
cat xargs.txt | xargs                   // 多行输入单行输出
cat xargs.txt | xargs -n3               // 使用 -n 进行多行输出(3表示3列)
```

### sed

一种流编辑器，它是文本处理中非常重要的工具。一般用于对文本内容做替换(s)、删除(d)等。

格式

```js
sed [选项] 's/old/new/g' [参数]
```

选项

```js
-e - // 使用多个指令
    i; // 插入文本。注意：mac 环境演示不生效
```

案例

```js
sed 's/book/books/g' test.txt   // 全局替换test.txt 文件中的book为books文本

sed '2,5d' sed.txt

sed '2d' test.txt               // 删除文件的第2行
sed '/^$/d' test.txt            // 删除test.txt文件中的空白行
sed '/^test/d' test.txt         // 删除test.txt文件中所有开头是test的行
sed -e '/^hello/d' -e '/^$/' test.txt // 删除以hello 开头的行和空白行
```

### uniq

显示或忽略相邻的重复行。

格式

```js
uniq[选项][参数];
```

选项

```js
-c - // count 在每列旁边显示该行重复出现的次数。
    d - // repeated 仅显示重复出现的行列。
    u; // unique 打印非邻近的重复行。
```

案例

```js
uniq uniq.txt // 相邻行的去重。
uniq -u uniq.txt   // 显示相邻行出现一次的文本。
```

```js
sort[选项][参数];
```

选项

```js
-r 或者 --reverse // 以相反顺序。
-u 或者 --unique  // 输出排序后去重的结果。
-n 或者 --numeric-sort   // 按照数字大小排序。
-k  // 通过一个key排序；KEYDEF给出位置和类型。
```

案例

```js
sort -nrk 2 sort.txt // 按照大小、反序、指定第二行排序
```

### grep

是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。用于过滤/搜索的特定字符。

格式

```js
grep "string" [选项] [参数]
```

选项

```js
-i 或者 --ignore-case	// 忽略大小写
-v 或者 --revert-match	// 排除指定字符串
-c 或者 --count         // 统计文件或者文本中包含匹配字符串的行数。
```

案例

```js
grep 'hello' -i test.txt  // 在test.txt文件中忽略大小写搜索出文本hello
grep 'hello' -v test.txt  // 在test.txt文件中搜索出排除hello的文本

grep 'hello' -ic grep.txt grep2.txt // 在多个文件中查找文本'hello'
```

### echo

输出指定的字符串或者变量。

格式

```js
echo[选项][参数];
```

选项

```js
-n > // 不换行 // 大于号，显示结果定向输出至文件
    -e; // 激活转义字符。
```

案例

文字闪动

```js
echo 'hello\nworld'   //换行显示hello world，引号可以省略

echo '你很美' > echo.txt   // 把文本‘你很美’输出至 echo.txt 文件

echo -e "\033[37;31;5m愿以吾辈之青春，护佑这盛世之中华...\033[39;49;0m"
```

颜色码：重置=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，洋红=35，青色=36，白色=37
红色数字处还有其他数字参数：0 关闭所有属性、1 设置高亮度（加粗）、4 下划线、5 闪烁、7 反显、8 消隐

## 文件管理

### cp

将源文件或目录复制到目标文件或目录中。

格式

```js
cp[选项][参数];
```

选项

```js
-f：  // 强行复制文件或目录，不论目标文件或目录是否已存在；
-i：  // 覆盖既有文件之前先询问用户；
-R/r：// 递归处理，将指定目录下的所有文件与子目录一并处理；
-u：  // 使用这项参数后只会在源文件的更改时间较目标文件更新时或是名称相互对应的目标文件并不存在时，才复制文件；
-v：  // 详细显示命令执行的操作
```

案例

```js
cp -rv dir1 dir        // 把dir1文件夹以及其子目录文件递归copy到dir文件夹下，并显示copy过程
cp -rv dir1/ dir       // dir1后边的/表示不会copy最外层文件夹dir1
cp -rv dir1 ./dir/dir2 //  把dir1文件夹以及子文件copy到dir文件夹下，并重命名为dir2
```

### mv

用来对文件或目录重新命名，或者将文件从一个目录移到另一个目录中。如果将一个文件移到一个已经存在的目标文件中，则目标文件的内容将被覆盖。

格式

```js
mv[选项][参数];
```

选项

| 命令格式         | 运行结果                                                            |
| ---------------- | :------------------------------------------------------------------ |
| mv 文件名 文件名 | 将源文件名 `重命名` 为目标文件名                                    |
| mv 文件名 目录名 | 将文件 `移动` 到目标目录                                            |
| mv 目录名 目录名 | 目标目录已存在，将源目录`移动`到目标目录；目标目录不存在则 `重命名` |
| mv 目录名 文件名 | 出错                                                                |

案例

```js
mv sort.txt sortNew.txt   // 把sort.txt 文件重命名问sortNew.txt
mv more.txt ../dir        // 把more.txt 文件移动到../dir 目录
mv dir1 dir2              // 若dir2已存在，则dir1移动到dir2；若dir2不存在则重命名为dir2
```

### cut

用来显示行中的指定部分，删除文件中指定字段。

格式

```js
cut[选项][参数];
```

选项

```js
-f： // 显示指定字段的内容；
-d： // 指定字段的分隔符，默认的字段分隔符为“TAB”；
-c   // 表示字符；
```

案例

使用 -f 选项提取指定字段（这里的 f 参数可以简单记忆为 --fields 的缩写）

```js
[root@localhost text]# cut -f2 -d";" cut.txt
Name
tom
jack
alex

cut -f-2 -d';' cut.txt    // 打印第2列及以前所有列
cut -f2 -d';' cut.txt    // 打印第2列
cut -f2- -d';' cut.txt   // 打印第2列及以后列
cut -f2-3 -d';' cut.txt  // 打印第2列及第3列

cut -c-2 cut.txt     // 打印第2个字符以及以前的字符
cut -c2 cut.txt     // 打印第2个字符
cut -c2- cut.txt    // 打印从第2个字符开始到结尾
cut -c2-7 cut.txt   // 打印第2个到第7个字符
```

### rm

用于删除给定的文件和目录。

注意：使用 rm 命令要格外小心。因为一旦删除了一个文件，就无法再恢复它。

格式

```js
rm[选项][参数];
```

选项

```js
-f - // 强制删除文件或目录；
    i - // 删除已有文件或目录之前先询问用户；
    r或 -
    R; // 递归处理，将指定目录下的所有文件与子目录一并处理；
--preserve -
    root - // 不对根目录进行递归操作；
    v; // 显示删除的过程
```

### head

显示文件的开头部分。

格式

```js
head[选项][参数];
```

选项

```js
-n; // 指定默认行，可以省略，直接写数字
```

案例

```js
head -3 head.txt          // 展示head.txt 文件的前三行
head -3 head.txt sort.txt // 展示head.txt 和 sort.txt 文件的前三行
```

### tail

在屏幕上显示指定文件的末尾若干行。

格式

```js
tail[选项][参数];
```

选项

```js
-c - // 输出文件尾部的N（N为整数）个字节内容；
    f - //显示文件最新追加的内容。“name”表示以文件名的方式监视文件的变化。“-f”与“-fdescriptor”等效；
    F; // 连用时功能相同；
```

案例

```js
tail tail.txt        // 默认显示tail.txt 文件的后10行
tail -4 tail.txt     // 显示tail.txt 文件的后4行
tail +20 tail.txt    // 从第20行至文件末尾
tail -c 10 tail.txt  // 显示文件file的最后10个字符
```

### file

用来探测给定文件的类型。

格式

```js
file[选项][参数];
```

选项

```js
-b：   // 列出辨识结果时，不显示文件名称；
-c：   // 详细显示指令执行过程，便于排错或分析程序执行的情形；
-f：   // 指定名称文件，其内容有一个或多个文件名称时，让file依序辨识这些文件，格式为每列一个文件名称；
-i     // 显示MIME类别。
-L：   // 直接显示符号连接所指向的文件类别；
-m：   // 指定魔法数字文件；
-v：   // 显示版本信息；
-z：   // 尝试去解读压缩文件的内容。
```

案例

```js
file wc.txt     // wc.txt: ASCII text
file -b wc.txt  // ASCII text
file -i wc.txt  // wc.txt: regular file 普通文件
```

### diff

比较 2 个文件的差异。

格式

```js
diff[选项][参数];
```

选项

```js
-y 或 --side-by-side   // 以并列的方式显示文件的异同之处。
-W 或 --width 　       // 在使用-y参数时，指定栏宽。
-u 或 -unified         // 以合并的方式来显示文件内容的不同。
```

案例

```js
diff -y test.txt index.txt           // 以并列的形式对比两个文件的不同
diff -y -W 50 test.txt index.txt     // 以并列并且指定行宽为50的形式对比两个文件的不同
diff -u test.txt index.txt           // 以合并的方式来显示文件内容的不同
```

### find

用来在指定目录下查找文件。

格式

```js
find[选项][参数];
```

选项

```js
-name                // 按照文件名查找
-o 或 or             // 或者
-i 或 igonre         // 忽略大小消息
!                    // 否定参数

-size<文件大小>        // 查找符合指定的文件大小的文件
    文件大小单元：
    * b —— 块（512字节）
    * c —— 字节
    * w —— 字（2字节）
    * k —— 千字节
    * M —— 兆字节
    * G —— 吉字节

-mtime<24小时数>      // 查找在指定时间曾被更改过的文件或目录，单位以24小时计算；

-type<文件类型>       // 只寻找符合指定的文件类型的文件
    文件类型:
    * f 普通文件
    * d 目录
    * l 符号连接
    * c 字符设备
    * b 块设备
    * s 套接字
    * p Fifo
```

案例

```js
find . -name "*.txt"                   // 在当前目录下查找以.txt结尾的文件名
find . -iname 'WC*'                    // 在当前目录下忽略大小写查找以WC开头的文件
find . -name "*.txt" -o -name "*.js"   // 当前目录及子目录下查找所有以.txt和.pdf结尾的文件
find . ! -name "*.txt"                 // 在当前目录下查找不是以.txt结尾的文件

find . -size +1k            // 搜索大于1KB的文件
find . -size  1k            // 搜索等于于1KB的文件
find . -size -1k            // 搜索小于1KB的文件

find . -mtime -2             // 查找最近2天内被修改过的所有文件
find . -mtime 2              // 查找恰好在2天前被修改过的所有文件
find . -mtime +2             // 查找超过2天内被修改过的所有文件

find . -type f              // 查找当前目录下文件类型是普通文件的所有文件
find . -type d              // 查找当前目录下文件类型是目录的所有文件
```

## 备份压缩

> ar、bunzip2、bzip2、bzip2recover、compress、cpio、dump、gunzip、gzexe、gzip、lha、restore、tar、unarj、unzip、zip、zipinfo

### tar

该格式仅打包，不压缩；想要既打包又压缩需配置压缩的格式：-z：有 gzip 属性；-j：有 bz2 属性的。

首先要弄清两个概念：`打包` 和 `压缩`:

-   打包是指将一大堆文件或目录变成一个总的文件；
-   压缩则是将一个大的文件通过一些压缩算法变成一个小文件。

为什么要区分这两个概念呢？

这源于 Linux 中很多压缩程序只能针对一个文件进行压缩，这样当你想要压缩一大堆文件时，
你得先将这一大堆文件先打成一个包（tar 命令），然后再用压缩程序进行压缩（gzip bzip2 命令）。

格式

```js
tar[选项][参数];
```

选项

```js
-c 或 --create     // 打包，创建一个新归档
-x 或 --extract    // 解包
-f 或 --file       // 指定操作类型的文件(必须参数)
-t 或 --list       // 列出文件
-v 或 --verbose    // 详细地列出处理的文件
-r 或 --append     // 是表示增加文件的意思
-u 或 --update     // 是表示更新文件的意思
```

案例

压缩方式总的说是 2 大类：第一种是 tar 方式压缩；

```js
-z：有gzip属性
-j：有bz2属性
-J：有xz属性

// 仅打包，不压缩
tar -cvf test.tar awk.txt awkcp.txt    // 把 awk.txt 和 awkcp.txt 文件打成一个 test.tar 包
tar -tvf test.tar                      // 查看 test.tar 包都包含哪些文件
tar -xvf test.tar                      // 解压 test.tar 压缩包

// 打包后压缩
tar -zcvf test.tar.gz test.txt       // 把 test.txt文件，打成 test.tar.gz 包后，以 gzip 格式压缩
tar -jcvf test.tar.bz2 test.txt      // 把 test.txt文件，打成 test.tar.bz2 包后，以 bzip2 格式压缩
```

::: tip tar -cvf 与 tar cvf 有什么区别?
这两个命令是等效的。- 的应用范围是参数分开使用的情况，连续无分隔参数可以不使用 -。
:::

第二种是非 tar 方式压缩，是根据各种格式压缩。压缩文件格式有很多种：.zip、.gz、.bz2、.xz、.jar .....

### zip

用来解压缩文件，或者对文件进行打包操作。zip 是个使用广泛的压缩程序，文件经它压缩后会另外产生具有“.zip”扩展名的压缩文件。

格式

```js
zip[选项][目标文件名].zip[原文件 / 目录名];
```

选项

```js
-r - // 递归处理
    q - // 不显示指令执行过程
    u; // 更换较新的文件到压缩文件内
```

格式

```js
unzip[选项][原文件名].zip;
```

选项

```js
-l; // 查看压缩包都包含哪些文件
```

### gzip

用来压缩文件。gzip 是个使用广泛的压缩程序，文件经它压缩过后，其名称后面会多处“.gz”扩展名。

压缩

```js
gzip[原文件名];

// 压缩之后，源文件被删除了
```

解压缩

```js
gunzip[原文件名].tar.gz;

// 解压之后原压缩包被删除了
```

选项

```js
-l; // 查看压缩包都包含哪些文件
```

### bzip2

用于创建和管理（包括解压缩）“.bz2”格式的压缩包（利用已经打包好的 tar 文件，直接执行压缩命令)。

压缩

```js
bzip2[原文件名];

// 压缩之后，源文件被删除了
```

解压

```js
bunzip2[原文件名].tar.bz2;

// 解压之后原压缩包被删除了
```

### jar

用于创建和管理（包括解压缩）.jar 格式的压缩包。

压缩

```js
jar cvf [目标文件名].jar [原文件名/目录名]
```

解压

```js
jar xvf [原文件名].jar

// 解压之后会生成 META-INF 文件夹
```
