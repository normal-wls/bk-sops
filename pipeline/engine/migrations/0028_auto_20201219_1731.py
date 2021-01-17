# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-12-19 09:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("engine", "0027_sendfailedcelerytask"),
    ]

    operations = [
        migrations.CreateModel(
            name="ResendCeleryTask",
            fields=[
                ("id", models.BigAutoField(db_index=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(db_index=True, max_length=1024, verbose_name="任务名")),
                ("kwargs", models.TextField(verbose_name="任务参数")),
                (
                    "type",
                    models.IntegerField(
                        choices=[(0, "empty"), (1, "process"), (2, "node"), (3, "schedule")], verbose_name="任务类型"
                    ),
                ),
                ("extra_kwargs", models.TextField(verbose_name="额外参数")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("bind_resource_id", models.CharField(default="", max_length=255, verbose_name="任务绑定资源ID")),
                ("resend_times", models.IntegerField(default=0, verbose_name="重试次数")),
                ("exec_trace", models.TextField(blank=True, null=True, verbose_name="重试错误信息")),
            ],
            options={"abstract": False,},
        ),
        migrations.AlterField(
            model_name="sendfailedcelerytask",
            name="id",
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False, verbose_name="ID"),
        ),
        migrations.AlterField(
            model_name="sendfailedcelerytask",
            name="name",
            field=models.CharField(db_index=True, max_length=1024, verbose_name="任务名"),
        ),
    ]