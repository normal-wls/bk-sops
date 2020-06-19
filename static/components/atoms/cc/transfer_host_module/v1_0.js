/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community
 * Edition) available.
 * Copyright (C) 2017-2020 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    $.atoms.cc_transfer_host_module = [
        {
            tag_code: "biz_cc_id",
            type: "select",
            attrs: {
                name: gettext("业务"),
                hookable: true,
                remote: true,
                remote_url: $.context.get('site_url') + 'pipeline/cc_get_business_list/',
                remote_data_init: function (resp) {
                    return resp.data;
                },
                disabled: !$.context.canSelectBiz(),
                validation: [
                    {
                        type: "required"
                    }
                ]
            },
            methods: {
                _tag_init: function () {
                    if (this.value) {
                        return
                    }
                    this._set_value($.context.getBkBizId())
                }
            }
        },
        {
            tag_code: "cc_module_select_method",
            type: "radio",
            attrs: {
                name: gettext("填参方式"),
                hookable: false,
                items: [
                    {value: "topo", name: gettext("拓扑选择")},
                    {value: "text", name: gettext("手动输入")},
                ],
                default: "topo",
                validation: [
                    {
                        type: "required"
                    }
                ],
            },
            events: [
                {
                    source: "cc_module_select_method",
                    type: "init",
                    action: function () {
                        this.emit_event(this.tagCode, "change", this.value)
                    }
                },
            ]
        },
        {
            tag_code: "cc_module_select_topo",
            type: "tree",
            attrs: {
                name: gettext("模块"),
                hookable: true,
                remote: true,
                remote_url: function () {
                    const url = $.context.canSelectBiz() ? '' : $.context.get('site_url') + 'pipeline/cc_search_topo/module/normal/' + $.context.getBkBizId() + '/';
                    return url
                },
                remote_data_init: function (resp) {
                    return resp.data;
                },
                validation: [
                    {
                        type: "custom",
                        args: function (value) {
                            let self = this;
                            let result = {
                                result: true,
                                error_message: ""
                            };
                            console.log(result);
                            if (!self.get_parent) {
                                return result
                            } else if (self.get_parent().get_child("cc_module_select_topo")) {
                                if (self.get_parent().get_child("cc_module_select_topo").value === "topo" && !value.length) {
                                    result.result = false;
                                    result.error_message = gettext("请选择模块");
                                }
                            } else if (!value.length) {
                                result.result = false;
                                result.error_message = gettext("请选择模块");
                            }
                            return result
                        }
                    }
                ]
            },
            events: [
                {
                    source: "biz_cc_id",
                    type: "init",
                    action: function () {
                        const cc_id = this.get_parent && this.get_parent().get_child('biz_cc_id').value;
                        this.items = [];
                        if (cc_id !== '') {
                            this.remote_url = $.context.get('site_url') + 'pipeline/cc_search_topo/module/normal/' + cc_id + '/';
                            this.remoteMethod();
                        }
                    }
                },
                {
                    source: "biz_cc_id",
                    type: "change",
                    action: function (value) {
                        if ($.context.canSelectBiz()) {
                            this._set_value('');
                        }
                        this.items = [];
                        if (value !== '') {
                            this.remote_url = $.context.get('site_url') + 'pipeline/cc_search_topo/module/normal/' + value + '/';
                            this.remoteMethod();
                        }
                    }
                },
                {
                    // 监听 cc_module_select_method 单选框变化，选择topo时显示该树形组件
                    source: "cc_module_select_method",
                    type: "change",
                    action: function (value) {
                        let self = this;
                        if (value === "topo") {
                            self.show();
                        } else {
                            self.hide();
                        }
                    }
                },
            ],
            methods: {}
        },
        {
            tag_code: "cc_module_select_text",
            type: "textarea",
            attrs: {
                name: gettext("模块"),
                hookable: true,
                placeholder: gettext("请输入完整路径，从业务拓扑开始，如`业务A>网络B>集群C>模块D`，多个目标模块用换行分隔"),
                validation: [
                    {
                        type: "custom",
                        args: function (value) {
                            let self = this;
                            let result = {
                                result: true,
                                error_message: ""
                            };
                            if (!self.get_parent) {
                                return result
                            } else if (self.get_parent().get_child("cc_module_select_method")) {
                                if (self.get_parent().get_child("cc_module_select_method").value === "text" && !value) {
                                    result.result = false;
                                    result.error_message = gettext("模块完整路径不能为空")
                                }
                            } else if (!value) {
                                result.result = false;
                                result.error_message = gettext("模块完整路径不能为空")
                            }
                            return result
                        }
                    }
                ]
            },
            events: [
                {
                    source: "cc_module_select_method",
                    type: "change",
                    action: function (value) {
                        let self = this;
                        if (value === "text") {
                            self.show();
                        } else {
                            self.hide();
                        }
                    }
                },
            ]
        },
        {
            tag_code: "cc_host_ip",
            type: "textarea",
            attrs: {
                name: gettext("主机内网IP"),
                placeholder: gettext("请输入主机内网IP，多个用换行分隔"),
                hookable: true,
                validation: [
                    {
                        type: "required"
                    }
                ]
            }
        },
        {
            tag_code: "cc_is_increment",
            type: "radio",
            attrs: {
                name: gettext("转移方式"),
                hookable: true,
                items: [
                    {"name": gettext("覆盖"), "value": 'false'},
                    {"name": gettext("追加"), "value": 'true'},
                ],
                default: 'false',
                validation: [
                    {
                        type: "required"
                    }
                ]
            }
        },
    ]
})();