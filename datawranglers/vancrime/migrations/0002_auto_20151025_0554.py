# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vancrime', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='location',
            old_name='block',
            new_name='address',
        ),
    ]
