# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community
Edition) available.
Copyright (C) 2017-2020 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""
import ujson as json
from cachetools.keys import hashkey
from django.core.handlers.wsgi import WSGIRequest

from gcloud.core.models import Project
from gcloud.apigw.constants import PROJECT_SCOPE_CMDB_BIZ


def get_project_with(obj_id, scope):
    get_filters = {}
    if scope == PROJECT_SCOPE_CMDB_BIZ:
        get_filters.update({"bk_biz_id": obj_id, "from_cmdb": True})
    else:
        get_filters.update({"id": obj_id})

    return Project.objects.get(**get_filters)


def api_hash_key(*args, **kwargs):
    """参考cachetools hashkey实现，对WSGIRequest参数对象进行特殊处理"""
    new_args = args
    for idx, arg in enumerate(args):
        if isinstance(arg, WSGIRequest):
            request = arg
            if request.method == "GET":
                request_params = str(sorted(request.GET.items()))
            elif request.method == "POST":
                params = json.loads(request.body)
                request_params = str(sorted(params.items()))
            else:
                break
            request_tag = "path:{},params:{}".format(request.path, request_params)
            new_args = args[:idx] + (request_tag,) + args[idx + 1 :]
            break

    return hashkey(*new_args, **kwargs)
