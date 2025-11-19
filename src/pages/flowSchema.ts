export type NodeType =
  | "start"
  | "task"
  | "decision"
  | "end"
  | "data"
  | "connector"
  | "process"
  | "database"
  | "manual"
  | "auto";
export type EdgeType =
  | "default"
  | "arrow"
  | "dashed"
  | "orth"
  | "manhattan"
  | "smooth"
  | "bezier";

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  shadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  targetMarker?: string;
  sourceMarker?: string;
  opacity?: number;
}

export interface NodeConfig {
  shape: string;
  width: number;
  height: number;
  label: string;
  attrs: {
    body: NodeStyle & { refPoints?: string; rx?: number; ry?: number };
    label: {
      text: string;
      fill?: string;
      fontSize?: number;
      fontFamily?: string;
      textAnchor?: "start" | "middle" | "end";
      textVerticalAnchor?: "top" | "middle" | "bottom";
    };
  };
  ports?: {
    groups: Record<
      string,
      {
        position: string;
        attrs: {
          circle: {
            r: number;
            magnet: boolean;
            stroke: string;
            strokeWidth: number;
            fill: string;
          };
        };
      }
    >;
    items: Array<{ group: string }>;
  };
}

export interface EdgeConfig {
  attrs: {
    line: EdgeStyle;
  };
  labels?: Array<{
    attrs: {
      label: {
        text: string;
        fill?: string;
        fontSize?: number;
        fontFamily?: string;
      };
      rect?: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        rx?: number;
        ry?: number;
      };
    };
    position?: number;
  }>;
  router?: { name: string };
  connector?: { name: string };
}

export const nodeTypes: NodeType[] = [
  "start",
  "task",
  "decision",
  "end",
  "data",
  "connector",
  "process",
  "database",
  "manual",
  "auto",
];
export const edgeTypes: EdgeType[] = [
  "default",
  "arrow",
  "dashed",
  "orth",
  "manhattan",
  "smooth",
  "bezier",
];

export const nodeDefaults: Record<NodeType, NodeConfig> = {
  start: {
    shape: "custom-rect",
    width: 120,
    height: 60,
    label: "开始",
    attrs: {
      body: {
        fill: "#52c41a",
        stroke: "#389e0d",
        strokeWidth: 2,
        rx: 30,
        ry: 30,
      },
      label: {
        text: "开始",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [{ group: "right" }, { group: "bottom" }],
    },
  },
  task: {
    shape: "custom-rect",
    width: 120,
    height: 60,
    label: "任务",
    attrs: {
      body: {
        fill: "#1890ff",
        stroke: "#096dd9",
        strokeWidth: 2,
        rx: 6,
        ry: 6,
      },
      label: {
        text: "任务",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  decision: {
    shape: "custom-polygon",
    width: 120,
    height: 60,
    label: "判断",
    attrs: {
      body: {
        fill: "#faad14",
        stroke: "#d48806",
        strokeWidth: 2,
        refPoints: "60,0 120,30 60,60 0,30",
      },
      label: {
        text: "判断",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  end: {
    shape: "custom-circle",
    width: 60,
    height: 60,
    label: "结束",
    attrs: {
      body: {
        fill: "#ff4d4f",
        stroke: "#cf1322",
        strokeWidth: 2,
      },
      label: {
        text: "结束",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [{ group: "top" }, { group: "left" }],
    },
  },
  data: {
    shape: "custom-polygon",
    width: 120,
    height: 60,
    label: "数据",
    attrs: {
      body: {
        fill: "#722ed1",
        stroke: "#531dab",
        strokeWidth: 2,
        refPoints: "0,30 60,0 120,30 60,60",
      },
      label: {
        text: "数据",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  connector: {
    shape: "custom-circle",
    width: 40,
    height: 40,
    label: "连接",
    attrs: {
      body: {
        fill: "#13c2c2",
        stroke: "#08979c",
        strokeWidth: 2,
      },
      label: {
        text: "连接",
        fill: "#fff",
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  process: {
    shape: "custom-rect",
    width: 140,
    height: 80,
    label: "子流程",
    attrs: {
      body: {
        fill: "#2f54eb",
        stroke: "#1d39c4",
        strokeWidth: 2,
        rx: 10,
        ry: 10,
      },
      label: {
        text: "子流程",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  database: {
    shape: "custom-polygon",
    width: 120,
    height: 80,
    label: "数据库",
    attrs: {
      body: {
        fill: "#fa8c16",
        stroke: "#d46b08",
        strokeWidth: 2,
        refPoints: "0,20 120,20 120,60 0,60 0,40 120,40",
      },
      label: {
        text: "数据库",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  manual: {
    shape: "custom-rect",
    width: 120,
    height: 80,
    label: "手动输入",
    attrs: {
      body: {
        fill: "#eb2f96",
        stroke: "#c41d7f",
        strokeWidth: 2,
        rx: 0,
        ry: 0,
      },
      label: {
        text: "手动输入",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
  auto: {
    shape: "custom-rect",
    width: 120,
    height: 60,
    label: "自动操作",
    attrs: {
      body: {
        fill: "#597ef7",
        stroke: "#3c5ce6",
        strokeWidth: 2,
        rx: 6,
        ry: 6,
      },
      label: {
        text: "自动操作",
        fill: "#fff",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#1890ff",
              strokeWidth: 2,
              fill: "#fff",
            },
          },
        },
      },
      items: [
        { group: "top" },
        { group: "right" },
        { group: "bottom" },
        { group: "left" },
      ],
    },
  },
};

export const edgeDefaults: Record<EdgeType, EdgeConfig> = {
  default: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "normal" },
    connector: { name: "normal" },
  },
  arrow: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
        sourceMarker: "circle",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "normal" },
    connector: { name: "normal" },
  },
  dashed: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "normal" },
    connector: { name: "normal" },
  },
  orth: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "orth" },
    connector: { name: "normal" },
  },
  manhattan: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "manhattan" },
    connector: { name: "normal" },
  },
  smooth: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "normal" },
    connector: { name: "smooth" },
  },
  bezier: {
    attrs: {
      line: {
        stroke: "#999",
        strokeWidth: 2,
        targetMarker: "classic",
      },
    },
    labels: [{ attrs: { label: { text: "" } } }],
    router: { name: "normal" },
    connector: { name: "curve" },
  },
};

export const nodeEditableProps = [
  { path: "label", label: "名称", type: "string" },
  { path: "attrs/body/fill", label: "填充色", type: "color" },
  { path: "attrs/body/stroke", label: "边框色", type: "color" },
  { path: "attrs/body/strokeWidth", label: "边框宽度", type: "number" },
  { path: "attrs/body/rx", label: "圆角半径", type: "number" },
  { path: "attrs/body/ry", label: "圆角半径", type: "number" },
  { path: "width", label: "宽度", type: "number" },
  { path: "height", label: "高度", type: "number" },
  { path: "attrs/label/fill", label: "文字颜色", type: "color" },
  { path: "attrs/label/fontSize", label: "字体大小", type: "number" },
  { path: "attrs/label/fontFamily", label: "字体", type: "string" },
  { path: "attrs/body/shadow", label: "阴影", type: "boolean" },
  { path: "attrs/body/shadowColor", label: "阴影颜色", type: "color" },
  { path: "attrs/body/shadowBlur", label: "阴影模糊", type: "number" },
  { path: "attrs/body/shadowOffsetX", label: "阴影偏移X", type: "number" },
  { path: "attrs/body/shadowOffsetY", label: "阴影偏移Y", type: "number" },
] as const;

export const edgeEditableProps = [
  { path: "attrs/line/stroke", label: "线条颜色", type: "color" },
  { path: "attrs/line/strokeWidth", label: "线条宽度", type: "number" },
  { path: "attrs/line/strokeDasharray", label: "虚线样式", type: "string" },
  { path: "attrs/line/targetMarker", label: "终点箭头", type: "string" },
  { path: "attrs/line/sourceMarker", label: "起点箭头", type: "string" },
  { path: "labels/0/attrs/label/text", label: "标签文字", type: "string" },
  { path: "labels/0/attrs/label/fill", label: "标签颜色", type: "color" },
  {
    path: "labels/0/attrs/label/fontSize",
    label: "标签字体大小",
    type: "number",
  },
  { path: "router/name", label: "路由算法", type: "string" },
  { path: "connector/name", label: "连接器", type: "string" },
] as const;

export const getNodeDefaults = (type: NodeType): NodeConfig =>
  nodeDefaults[type] || nodeDefaults.task;
export const getEdgeDefaults = (type: EdgeType): EdgeConfig =>
  edgeDefaults[type] || edgeDefaults.default;
