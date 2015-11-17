# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('vancrime', '0006_loadeddata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('latitude', models.DecimalField(null=True, blank=True, max_digits=9, decimal_places=6)),
                ('longitude', models.DecimalField(null=True, blank=True, max_digits=9, decimal_places=6)),
            ],
        ),
        migrations.CreateModel(
            name='VanCrimeUser',
            fields=[
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='favorite',
            name='user',
            field=models.ForeignKey(to='vancrime.VanCrimeUser'),
        ),
        migrations.AlterUniqueTogether(
            name='favorite',
            unique_together=set([('user', 'name')]),
        ),
    ]
