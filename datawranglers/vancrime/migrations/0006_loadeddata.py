# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vancrime', '0005_auto_20151026_0025'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoadedData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('url', models.URLField(unique=True)),
            ],
        ),
    ]
