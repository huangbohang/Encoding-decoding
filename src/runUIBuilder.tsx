import { bitable, UIBuilder } from "@lark-base-open/js-sdk";
import { encode, decode } from "./Base64.js";
import { encodeUn, decodeUn } from "./Unicode.js";
import { encodeAs, decodeAs } from "./ASCII.js";
export default async function main(uiBuilder: UIBuilder) {
  let options = [{
    label: "url编码/解码",
    value: "url"
  },
  {
    label: "Base64编码/解码",
    value: "Base64"
  },
  {
    label: "Unicode编码/解码",
    value: "Unicode"
  },
  {
    label: "ASCII编码/解码",
    value: "ASCII"
  }
  ];
  uiBuilder.form(form => ({
    formItems: [
      form.tableSelect('table', { label: '选择数据表' }),
      form.input('path', { label: '无需转换的路径', placeholder: '附加路径（默认添加到前面，如没有可不填）', defaultValue: '' }),
      form.select('select1', { label: '输入转换的编码类型', options: options, defaultValue: 'Base64' }),
      form.select('select2', { label: '编码/解码', options: [{ label: '编码', value: 'encode' }, { label: '解码', value: 'decode' }], defaultValue: 'encode' }),
      form.fieldSelect('field1', { label: '选择需要转换的字段', sourceTable: 'table' }),
      form.fieldSelect('field2', { label: '转换完成并需要填充的字段', sourceTable: 'table' }),
    ],
    buttons: ['确认'],
  }), async ({ values  }) => {
    const table = await bitable.base.getActiveTable();
    let { field1, select1, select2, field2, path } = values;
    let codeMap = {
      url: {
        encode: encodeURIComponent,
        decode: decodeURIComponent
      },
      Base64: {
        encode: encode,
        decode: decode
      },
      Unicode: {
        encode: encodeUn,
        decode: decodeUn
      },
      ASCII: {
        encode: encodeAs,
        decode: decodeAs
      }
    }
    // 分页改造
    let recordIdList:string[] = []
    let hasMorePage = false
    let nextPageToken: number | undefined = undefined
    do {
      const { hasMore, pageToken, recordIds } = await table.getRecordIdListByPage({
          pageToken: nextPageToken,
          pageSize: 200
      })
      nextPageToken = pageToken
      hasMorePage = hasMore
      recordIdList = recordIdList.concat(recordIds)
  } while (hasMorePage)

    let contents = [];
    for (let i = 0; i < recordIdList.length; i++) {
      const recordId = recordIdList[i]
      const cell = await table.getCellString(field1.id, recordId);
      let content = path ? `${path}${codeMap[select1][select2](cell)}` : codeMap[select1][select2](cell);
      if (cell) {
        contents.push({
          recordId: recordId,
          fields: {
            [field2.id]: content
          }
        });
      }
    }
    const res = await table.setRecords(contents)
  });
}
