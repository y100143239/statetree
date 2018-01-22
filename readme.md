# 状态树

## 1. 简介

对 jstree.js 的简单封装。
  
依赖：
 * [jQuery](http://jquery.com/)
 * [jstree](https://www.jstree.com/)
 * [font-awesome](http://fontawesome.io/)
 
说明
 * 在PKUI里，已包含这些依赖文件

## 2. 编撰

  吴钦飞（wuqinfei@qq.com）
  
## 3. 示例

![示例](./doc/images/1.png)

演示：https://forwardnow.github.io/statetree/dist/index.html

## 4. 使用

    <div id="selectTree" data-options="......"></div>
    <script>
    var 
        $selectTree = $( "#selectTree" ),
        options = $selectTree.data( "options" )
    ;
    $selectTree.stateTree( options );
    </script>


### 4.1 参数

参考：`dist/index.html`

    <div id="selectTree"
         data-options='{
            # 核心参数
            "core": {
                # 请求GridResult数据（自关联的数据，有“id”he“parentId”），可以构成“树”形结构
                "url": "../test/data.json",
                # 默认图标 - 父节点
                "defaultFolderIcon": "fa fa-folder",
                # 默认图标 - 叶子节点
                "defaultFileIcon": "fa fa-file",
                # 指定根节点，如 "id_1", { "id_1": true, "id_2": true }。
                # 如果不指定，则将“parentId”为"-1"、-1、null、undefined的节点作为根节点
                "rootId": null
            },
            # 字段映射
            "mapping": {
                "id": "menuId",
                "text": "menuName",
                # 图标
                "icon": "icon",
                "parentId": "treeParentid",
                # 可见性
                "visible": "visiable",
                # 是否展开
                "expand": "expand",
                # 是否被选中
                "selected": "selected"
            }
         }'
    ></div>
    
### 4.2 API

参考：`src/tree.js`


* `$selectTree.stateTree( "getData" );`
    * @description 获取原始数据
    * @return {Array}
* `$selectTree.stateTree( "getNodeById", idList );`
    * @description 获取指定id的节点
    * @param idList {String|Array} 单个id字符串 或 多个id组成的数组
    * @return {Array} 
* `$selectTree.stateTree( "getSelectedNodes" );`
    * @description 获取选中的节点
    * @return {Array}
* `$selectTree.stateTree( "selectNodeById", idList );`
    * @description 选中指定id的节点
    * @param idList {String|Array} 单个id字符串 或 多个id组成的数组
* `$selectTree.stateTree( "deselectNodeById", idList );`
    * @description 反选指定id的节点
    * @param idList {String|Array} 单个id字符串 或 多个id组成的数组