# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2021-03-08 07:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='tags',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
