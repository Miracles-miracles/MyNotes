---
title: CAPL 基础
date: 2026-07-07
tags: [CAPL, CANoe]
category: 汽车领域
---

# CAPL 基础

## 基本概念

### CAPL (Communication Access Programming Language)

CANoe/CANalyzer 的专用编程语言，用于编写测试脚本。

### 特点

- 类似 C 语言语法
- 专门为 CAN 通信设计
- 支持事件驱动编程
- 集成丰富的 CAN 相关函数

## 程序结构

### 基本框架

```capl
/* 包含头文件 */
#include <can.h>

/* 变量声明 */
variables {
    int counter = 0;
    message CAN_Msg msg;
}

/* 程序开始 */
on start {
    write("CAPL Program Started");
}

/* 定时器事件 */
on timer 1000 {
    counter++;
    write("Counter: %d", counter);
}

/* CAN 消息接收事件 */
on message 0x123 {
    write("Received message: ID=0x%X, Data=%02X %02X", 
          this.id, this.byte(0), this.byte(1));
}
```

### 事件类型

| 事件 | 说明 |
|------|------|
| `on start` | 程序启动时触发 |
| `on stop` | 程序停止时触发 |
| `on timer` | 定时器触发 |
| `on message` | CAN 消息接收 |
| `on key` | 按键事件 |
| `on error` | 错误事件 |

## 数据类型

### 基本类型

```capl
int         // 整型，32位
long        // 长整型，64位
float       // 浮点型
double      // 双精度浮点型
char        // 字符型
string      // 字符串
boolean     // 布尔型
```

### CAN 专用类型

```capl
message     // CAN 消息
signal      // CAN 信号
timer       // 定时器
```

### 数组

```capl
int arr[10];
float data[5][5];
```

## 消息处理

### 发送消息

```capl
message 0x123 txMsg;

on start {
    // 设置消息数据
    txMsg.byte(0) = 0x11;
    txMsg.byte(1) = 0x22;
    txMsg.byte(2) = 0x33;
    
    // 发送消息
    output(txMsg);
    
    // 直接发送
    output(0x123, 0xAA, 0xBB, 0xCC);
}
```

### 接收消息

```capl
on message 0x123 {
    // this 指向当前消息
    write("ID: 0x%X", this.id);
    write("DLC: %d", this.dlc);
    
    // 遍历数据
    for (int i = 0; i < this.dlc; i++) {
        write("Byte %d: 0x%02X", i, this.byte(i));
    }
}

// 接收多个 ID
on message 0x100 to 0x1FF {
    write("Received message in range: 0x%X", this.id);
}

// 接收所有消息
on message * {
    write("Received any message: 0x%X", this.id);
}
```

## 信号处理

### 信号定义

```capl
signal EngineSpeed : 0..65535 @ 0x123.0;
signal Throttle : 0..100 @ 0x123.1;
```

### 信号发送

```capl
variables {
    signal EngineSpeed = 2000;
    signal Throttle = 50;
}

on timer 100 {
    EngineSpeed = EngineSpeed + 100;
    Throttle = Throttle + 1;
    output(0x123);
}
```

### 信号接收

```capl
on signal EngineSpeed {
    write("Engine Speed: %d RPM", this);
}

on signal Throttle {
    write("Throttle: %d %%", this);
}
```

## 定时器

### 单次定时器

```capl
variables {
    msTimer myTimer;
}

on start {
    // 启动定时器，1秒后触发
    setTimer(myTimer, 1000);
}

on timer myTimer {
    write("Timer triggered!");
}
```

### 周期性定时器

```capl
on timer 1000 {
    write("This runs every 1 second");
}

on timer 50 {
    write("This runs every 50ms");
}
```

## 常用函数

### 输出函数

```capl
write("Hello World");
write("Value: %d, Hex: 0x%X, Float: %.2f", 100, 255, 3.14);
```

### 时间函数

```capl
timeNow();           // 获取当前时间（毫秒）
timeNowNS();         // 获取当前时间（纳秒）
sleep(1000);         // 延迟 1 秒
```

### CAN 函数

```capl
output(msg);         // 发送消息
send(msg);           // 发送消息（同 output）
read(msg);           // 读取消息
getCanId(msg);       // 获取消息 ID
setCanId(msg, id);   // 设置消息 ID
```

### 数学函数

```capl
abs(x);              // 绝对值
sqrt(x);             // 平方根
sin(x);              // 正弦
cos(x);              // 余弦
rand();              // 随机数
```

### 字符串函数

```capl
strlen(str);         // 字符串长度
strcpy(dst, src);    // 字符串复制
strcmp(s1, s2);      // 字符串比较
strcat(s1, s2);      // 字符串拼接
```

## 测试场景示例

### 示例 1：发送周期性消息

```capl
variables {
    message 0x123 msg;
    int count = 0;
}

on timer 100 {
    msg.byte(0) = count;
    msg.byte(1) = count >> 8;
    output(msg);
    count++;
}
```

### 示例 2：模拟传感器数据

```capl
variables {
    message 0x200 sensorMsg;
    float temperature = 25.0;
}

on timer 50 {
    // 模拟温度变化
    temperature = temperature + (rand() % 100 - 50) / 100.0;
    
    // 转换为整数（假设分辨率为 0.1°C）
    sensorMsg.byte(0) = (int)(temperature * 10) & 0xFF;
    sensorMsg.byte(1) = ((int)(temperature * 10) >> 8) & 0xFF;
    
    output(sensorMsg);
    write("Temperature: %.2f °C", temperature);
}
```

### 示例 3：验证消息响应

```capl
variables {
    message 0x300 request;
    message 0x301 response;
    msTimer responseTimer;
    boolean responseReceived = false;
}

on start {
    // 发送请求
    output(request);
    
    // 启动响应定时器（超时 100ms）
    setTimer(responseTimer, 100);
}

on message 0x301 {
    responseReceived = true;
    cancelTimer(responseTimer);
    write("Response received!");
}

on timer responseTimer {
    if (!responseReceived) {
        write("Response timeout!");
    }
}
```

## CAPL 调试

### 输出窗口

使用 `write()` 函数输出调试信息。

### 变量监视

在 CANoe 中添加变量到监视窗口。

### 断点调试

在代码中设置断点，逐步执行。

## 最佳实践

### 代码结构

- 使用 `variables` 块声明全局变量
- 使用事件驱动编程
- 保持函数简洁

### 命名规范

- 变量名使用驼峰命名
- 常量名使用大写
- 消息名使用描述性名称

### 错误处理

- 添加适当的错误检查
- 使用 `on error` 事件处理异常