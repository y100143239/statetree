const $ = require( "jquery" );

/**
 * @description 默认参数
 */
Tree.prototype.defaults = {
    "core": {
        "url": "./testJsTree_2.json",
        "defaultFolderIcon": "fa fa-folder",
        "defaultFileIcon": "fa fa-file",
        // { 1: true, 2: true }
        "rootId": null
    },
    "mapping": {
        "id": "menuId",
        "text": "menuName",
        "icon": "icon",
        "parentId": "treeParentid",
        "visible": "visiable",
        "expand": "expand",
        "selected": "selected"
    }
};

/**
 * @param $target 菜单树目标
 * @param options {*?}
 * @constructor
 */
function Tree( $target, options ) {
    this.$target = $target;
    this.options = $.extend( true, {}, this.defaults, options );
    this.idMapping = {};
    this._init();
}


/**
 * @description 缓存。缓存指定URL的数据
 * @type {{}}
 */
Tree.cache = {};

/**
 * @description 初始化
 * @private
 */
Tree.prototype._init = function () {
    var
        _this = this,
        options = this.options,
        url = options.core.url
    ;

    // 已缓存
    if ( Tree.cache[ url ] ) {
        _this.createJsTree( Tree.cache[ url ] );
        return;
    }

    // Ajax请求
    $.ajax( {
        url: url,
        method: "GET",
        cache: false
    } ).done( function ( gridResult ) {
        if ( !gridResult ||
            gridResult.success === false ||
            gridResult.data === null ||
            gridResult.data === undefined ) {

            alert( ( gridResult && gridResult.message ) || "状态树构建失败！" );
            return;
        }
        Tree.cache[ url ] = gridResult;
        _this.createJsTree( gridResult );
    } ).fail( function ( ) {
        console.error( "【构建状态树】请求失败！" );
    } );


};

/**
 * @description 创建JsTree
 * @param gridResult {{data:*}}
 */
Tree.prototype.createJsTree = function ( gridResult ) {
    var
        _this = this,
        options = this.options,
        originData,
        fmtData,
        jstreeData,
        jstreeOptions = {},
        mapping = options.mapping
    ;

    originData = gridResult.data;

    this.originData = originData;

    fmtData = fmtListData.call( _this, originData );

    jstreeData = getTreeList( {
        data: fmtData,
        rootId: options.core.rootId,
        idName: mapping.id,
        parentIdName: mapping.parentId,
        childrenName: "children"
    } );

    jstreeOptions.core = {
        "data" : jstreeData,
        "dblclick_toggle": false,
        "check_callback" : true
    };

    jstreeOptions.checkbox = {
        keep_selected_style: false
    };

    jstreeOptions.plugins = [ /*"wholerow",*/ "checkbox" ];

    _this.$target.jstree( jstreeOptions );

    // 标志
    _this.$target.addClass( "jstree-statetree" );
};

/**
 * @description 获取原始数据
 * @return {Array}
 */
Tree.prototype.getData = function () {
    return this.originData;
};

/**
 * @description 获取指定id的节点
 * @param idList {String|Array} 单个id字符串 或 多个id组成的数组
 * @return {Array}
 */
Tree.prototype.getNodeById = function ( idList ) {
    var
        ref = this.$target.jstree( true ),
        node,
        nodeList = [],
        i, len, id
    ;
    if ( typeof idList === "string" ) {
        idList = [ idList ];
    }
    for ( i = 0, len = idList.length; i < len; i++ ) {
        id = this.idMapping[ idList[ i ] ];
        node = ref.get_node( id );
        nodeList.push( node );
    }
    return nodeList;
};

/**
 * @description 获取选中的节点
 * @return {Array}
 */
Tree.prototype.getSelectedNodes = function () {
    var
        ref = this.$target.jstree( true ),
        selectedNodes = ref.get_selected( true )
    ;
    return selectedNodes;
};

/**
 * @description 选中指定id的节点
 * @param idList {String|Array} 单个id字符串 或 多个id组成的数组
 */
Tree.prototype.selectNodeById = function ( idList ) {
    var
        ref = this.$target.jstree( true ),
        i, len,
        idArray = []
    ;
    for ( i = 0, len = idList.length; i < len; i++ ) {
        idArray.push( this.idMapping[ idList[ i ] ] );
    }
    ref.select_node( idArray );
};

/**
 * @description 反选指定id的节点
 * @param idList {String|Array} 单个id字符串 或 多个id组成的数组
 */
Tree.prototype.deselectNodeById = function ( idList ) {
    var
        ref = this.$target.jstree( true ),
        i, len,
        idArray = []
    ;
    for ( i = 0, len = idList.length; i < len; i++ ) {
        idArray.push( this.idMapping[ idList[ i ] ] );
    }
    ref.deselect_node( idArray );
};


/**
 * @description 格式化 列表数据
 * @param list {Array}
 * @returns {Array}
 */
function fmtListData( list ) {
    var
        parentIdSet = {},
        fmtList = [],
        options = this.options,
        idMapping = this.idMapping,
        mapping = options.mapping
    ;

    $.each( list, function ( index, item ) {
        parentIdSet[ item[ mapping.parentId ] ] = true;
    } );

    // 添加 jstree 必须的属性
    $.each( list, function ( index, item ) {
        var
            data,
            id,
            text,
            icon
        ;

        if( ! getBoolean( item[ mapping.visible ] ) ) {
            return;
        }

        // 绑定的 data
        data = $.extend( true, {}, item );

        // ID（HTML属性）
        id = "jstree_node_"  + ( new Date() ).getTime() + "_" + item[ mapping.id ];

        idMapping[ item[ mapping.id ] ] = id;

        text = item[ mapping.text ];

        icon = item[ mapping.icon ];

        if ( ! icon ) {
            icon = parentIdSet[ item[ mapping.id ] ] ?
                options.core.defaultFolderIcon  :
                options.core.defaultFileIcon
            ;
        }

        fmtList.push( $.extend( true, {}, item, {
            "data": data,
            "id": id,
            "text": text,
            "icon": icon,
            "state": {
                "opened": getBoolean( item[ mapping.expand ] ),
                "selected": getBoolean( item[ mapping.selected ] )
            }
        } ) );

    } );

    return fmtList;
}

/**
 * @description 根据参数获取树形数据
 * @param options
 * @return {*}
 */
function getTreeList( options ) {
    var
        data = options.data,
        rootId = options.rootId,
        idName = options.idName || "id",
        parentIdName = options.parentIdName || "parentId",
        childrenName = options.childrenName || "children",
        returnData,
        childrenCollection = {},
        parentId,
        rootList = []
    ;

    // 如果没有指定根节点的ID，则将所有 treeParentId == null 的节点作为根节点
    if ( rootId === null || rootId === undefined ) {
        // rootId = data[ 0 ][ idName ];
        $.each( data, function ( index, elt ) {
            var parentId = elt[ parentIdName ];
            if ( parentId === null
                || parentId === undefined
                || parentId === -1
                || parentId === "-1") {
                rootList.push( elt );
            }
        } );
    }
    else {
        // 多个 rootId
        if ( typeof rootId === "object" ) {
            $.each( data, function ( index, elt ) {
                var
                    id = elt[ idName ]
                ;
                if ( rootId.hasOwnProperty( id ) ) {
                    rootList.push( elt );
                }
            } );
        }
        // 单个
        else {
            $.each( data, function ( index, elt ) {
                var
                    id = elt[ idName ]
                ;
                if ( id === rootId ) {
                    rootList.push( elt );
                    return false;
                }
            } );
        }
    }


    $.each( data, function ( index, elt ) {
        if ( elt === null || elt === undefined ) {
            return;
        }
        parentId = elt[ parentIdName ];
        childrenCollection[ parentId ] = childrenCollection[ parentId ] || [];
        childrenCollection[ parentId ].push( elt );
    } );

    returnData = fmtData( rootList );

    function fmtData( data ) {
        var list = []
        ;
        if ( !data || !data.length ) {
            return null;
        }
        $.each( data, function ( index, elt ) {
            var record = elt,
                newRecord
            ;
            newRecord = $.extend( true, {}, record );
            newRecord[ childrenName ] = fmtData( childrenCollection[ record[ idName ] ] );
            list.push( newRecord );
        } );
        return list;
    }


    return returnData;

}

/**
 * @description 获取布尔值
 * @param value
 * @return {boolean}
 */
function getBoolean ( value ) {
    var
        booleanValue = true
    ;

    if ( value === 0 ||
        value === "0" ||
        value === false ||
        value === null ||
        value === undefined
    ) {
        booleanValue = false;
    }

    return booleanValue;
}


module.exports = Tree;