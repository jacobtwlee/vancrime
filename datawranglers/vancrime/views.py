from django.shortcuts import render
from django.http import Http404, HttpResponseRedirect
from django.contrib.auth import logout
from .models import Crime, Favorite
# from .forms import CrimeForm
from bokeh.plotting import figure, output_file, show
from bokeh.embed import components
from bokeh.resources import CDN
from math import pi 
import calendar
import re
# for authentication
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from social.apps.django_app.default.models import UserSocialAuth

def changeacct_view(request):
    username = request.user.username
    newusername = request.POST['newusername']
    password = request.POST['password']
    newpassword = request.POST['newpassword1']
    newemail = request.POST['newemail']

    # return if name already in db
    if username != newusername:
        if User.objects.filter(username = newusername).exists():
            return HttpResponseRedirect('/?error=baduser')

    # authenticating the user
    auth_user = authenticate(username=username, password=password)
    if auth_user == None:
        # TODO: add appropriate case to error message handler
        return HttpResponseRedirect('/?error=badpass')
    else:
        accountChanged = False
        user = User.objects.get(username = username)
        if newusername:
            newusername = newusername.strip()
            username = newusername
            user.username = newusername
            accountChanged = True
        if newpassword:
            # frontend validates the new password was entered the same twice
            newpassword = newpassword.strip()
            user.set_password(newpassword)
            accountChanged = True
        if newemail:
            newemail = newemail.strip()
            user.email = newemail
            accountChanged = True
        if not accountChanged:
            return HttpResponseRedirect('/?msg=nochange')
        user.save()
        # on password change, Django will drop any existing user sessions
        # so log user back in before redirecting
        if newpassword:
            auth_user = authenticate(username=username, password=newpassword)
            login(request,auth_user)
        return HttpResponseRedirect('/?msg=change')
    
def register_view(request):
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    # validate that the username is free
    if User.objects.filter(username = username).exists():
        return HttpResponseRedirect('/?error=baduser')
    else:
        user = User.objects.create_user(username,email,password)
        user.save()
        auth_user = authenticate(username=username, password=password)
        login(request,auth_user)
        return HttpResponseRedirect('/?msg=regpass')

def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)

    if user == None:
        return HttpResponseRedirect('/?error=badlogin')
    
    if user.is_active:
        login(request,user)
        return HttpResponseRedirect('/?msg=welcome')
    else:
        return HttpResponseRedirect('/?error=login')
        

def index(request):
    crimes = Crime.objects.all()
    
    latestYear = crimes.order_by("-year")[0].year
    latestMonth = crimes.filter(year=latestYear).order_by("-month")[0].month
    
    distinctYears = crimes.values_list('year', flat=True).distinct()
    distinctMonths = crimes.values_list('month', flat=True).distinct()
    
    latitude = request.GET.get("lat")
    longitude = request.GET.get("lng")
    year = request.GET.get("year")
    month = request.GET.get("month")
    
    isYearValid = (year not in distinctYears) and (month not in distinctMonths)
    
    if (year is None) or (month is None) or (not isYearValid):
        year = latestYear
        month = latestMonth
        
    if (latitude is None) or (longitude is None):
        latitude = "null"
        longitude = "null"
    else:
        isLatitudeValid = re.match("^-?\d{2}\.\d{6}$", latitude) != None
        isLongitudeValid = re.match("^-?\d{2,3}\.\d{6}$", longitude) != None
        if not(isLatitudeValid and isLongitudeValid):
            latitude = "null"
            longitude = "null"
    
    try:
        isSocialUser = UserSocialAuth.objects.filter(user=request.user).exists()
    except:
        isSocialUser = False
    
    context = {
        "default_year": year,
        "default_month": month,
        "default_latitude": latitude,
        "default_longitude": longitude,
        "user": request.user,
        "isSocialUser": isSocialUser
    }
    
    return render(request, 'vancrime/index.html', context)

def summary_index(request):
    all_crimes = Crime.count_all_crimes_by_type()
    total = Crime.objects.count()
    context = {'all_crimes': all_crimes, "total": total}
    return render(request, 'vancrime/summary_table.html', context)

def summary_date(request, month, year):
    month = int(month)
    year = int(year)
    try :
       all_crimes = Crime.count_crimes_by_time_type(year,month)
       total = Crime.count_crimes_by_time(year,month)
       month = calendar.month_name[month]
       context = {'all_crimes': all_crimes, 'total': total, 'month': month, 'year': year}
    except IndexError:
       raise Http404("Invalid month entered.")
    return render(request, 'vancrime/summary_table.html', context)

def graph(request, month, year):
    monthRange = int(request.GET.get("monthRange"))
    crimeType = request.GET.get("crimeType")
        
    if monthRange is None:
        monthRange = 12
        
    if crimeType is None or crimeType == "all":
        crimeType = "All Crimes"
    
    month = int(month)
    year = int(year)
    try:
        dat = Crime.data_summary(year,month,monthRange)
        title = str(monthRange) + '-Month Crime Trend (' + crimeType + ') Since ' + calendar.month_name[month] + ' ' + str(year)
        graph = figure(x_range = list(dat.index), x_axis_label = "Month", y_axis_label = "Number of Crimes", width = 1200, title = title, tools="pan,wheel_zoom,box_zoom,reset,save")
        graph.line(list(dat.index), dat[crimeType])
        graph.xaxis.major_label_orientation = - pi/2
        script, div = components(graph, CDN)
        return render(request, 'vancrime/crime_summary_graph.html', {'the_script': script, 'the_div': div})
    except IndexError:
        raise Http404("Invalid month entered.")
        
def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')
