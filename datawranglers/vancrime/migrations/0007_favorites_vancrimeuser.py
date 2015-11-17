# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vancrime', '0006_loadeddata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Favorites',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(unique=True, max_length=100)),
                ('latitude', models.DecimalField(blank=True, max_digits=9, null=True, decimal_places=6)),
                ('longitude', models.DecimalField(blank=True, max_digits=9, null=True, decimal_places=6)),
            ],
        ),
        migrations.CreateModel(
            name='VanCrimeUser',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('favorites', models.ManyToManyField(to='vancrime.Favorites')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
