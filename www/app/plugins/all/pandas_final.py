#!/usr/bin/env python3
# -*- coding: utf8 -*-
import pandas as pd

"""
______________________

**DATA SCIENCE**
The work steps for this file... 
______________________

    -    **Practice**
        *    Clean empty
        *    Format data
______________________

    -    **Next**
        *    Duplicates
        *    Remove columns
        *    Salaries dashboard:
            +    Weekly
            +    Montly
            +    Yearly
______________________
"""

def print_spaces(title, msg=False):
	print("")
	print("")
	print("")
	print("_________| | | | |________________") if not msg else print("!-----------------!")
	print(title)
	print("_________| | | | |________________")


print_spaces('------- BEGIN -------')



# ______________________________________________________
# I. SET THE FILE PATH
# Change this path to that of your file… 
fp = '/home/nkensa/GDrive-local/Tree/Workspaces/dev/frameworks/pandas/EmployeeTBL.csv'




# ______________________________________________________
# II. READ DATAFRAME INTO VARIABLE
df = pd.read_csv(fp)

# III. PRINT
# Quick print to check
df.head()

# Print all rows, with truncated columns if larger than default limit
print(df)
# Print full dataframe: all rows and columns
print_spaces('# II. READ DATAFRAME INTO VARIABLE')
print(df.to_string())



# ______________________________________________________
# III. CLEANING: EMPTY CELLS
# USE ONE OF THE OPTIONS BELOW
# NOTE: ALWAYS KEEP THE PREVIOUS DATAFRAME VARIABLE BEFORE EACH OPERATION, SO AS TO BE ABLE TO GO BACK TO IT IF SOMETHING GOES WRONG

# Keep
new_df = df.copy()

# If something goes wrong, you can get back to the previous good version with
# > df = new_df.copy()


# __________________
# 1. Clean empty cells
#	This will delete any row that has an empty cell
df = df.dropna()
print_spaces('# III. CLEANING: EMPTY CELLS')
print(df.to_string())

# 2. Replacing empty cells
#	This will keep rows that have empty cells, replacing them with given value
# > df = df.fillna(0)
# > print(df.to_string())


# 3. Replacing empty cells only for one column, Example: Position
# > df = df["Position"].fillna('Unknown')
# > print(df.to_string())



# NOTE: IT'S POSSIBLE TO DO ALL THE OPERATIONS ABOVE 'IN PLACE', REPLACING THE CURRENT DATAFRAME WITHOUT CREATING A NEW VARIABLE, BUT IT'S NOT RECOMMENDED, IN THE BEGINNING
# > df["Position"].fillna('Unknown', inplace = True)
# > print(df.to_string())




# ______________________________________________________
# IV. CLEANING: FIXING WRONG FORMAT

# Keep
new_df = df.copy()


# __________________
# 1. Fix incorrect dates
# > df['Hired Year'] = pd.to_datetime(df['Hired Year'])
# > print(df.to_string())

# NOTE: IN CASE DATE FORMATS CAUSE ERRORS, WE WILL LOOK AT WAYS TO FIX THEM… SEE BELOW, NEAR END


# __________________
# 1. Fix incorrect numbers: Int, Float… 
df = df.astype({'Age':'int'})
print_spaces('IV. CLEANING: FIXING WRONG FORMAT')
print(df.to_string())

# 2. Salary column must be reformatted first… see below
# > df = df.astype({'Salary':'float'})
# > print(df.to_string())




# ______________________________________________________
# IV. CLEANING: FINDING AND REMOVING DUPLICATES

# Keep
new_df = df.copy()


# __________________
# 1. Finding
print(df.duplicated())


# 2. Remove
df.drop_duplicates(inplace=True)
print_spaces('# IV. CLEANING: FINDING AND REMOVING DUPLICATES')
print(df.to_string())




# ______________________________________________________
# V. CLEANING / FORMATTING: CHANGE/FORMAT COLUMN VALUES

# Keep
new_df = df.copy()

# __________________
# 1. Apply
# src: https://sparkbyexamples.com/pandas/pandas-apply-with-lambda-examples/
# Convert salary string to float
def to_float(x):
	try:
		return float(x.replace('$', '').replace(',', ''))
	except Exception:
		return x
		
df["Salary"] = df["Salary"].apply(lambda x : to_float(x))
print(df.to_string())


# __________________
# 2. Replace '[$0]' by empty value in 'Salary' column
# 3. Remove empty values from DataFrame
df["Salary"] = df["Salary"].apply(lambda x : None if x == '[$0]' else x)
df = df.dropna()

print_spaces('# V. CLEANING / FORMATTING: CHANGE/FORMAT COLUMN VALUES')
print(df.to_string())






# ______________________________________________________
# VI. CORRELATIONS

# Keep
new_df = df.copy()

# __________________
# 1. Between 2 number columns
print_spaces('# VI. CORRELATIONS - Salary / Age')
print(df['Salary'].corr(df['Age']))


# __________________
# 2. Gender correlation
# Copy to numerify gender column and calculate correlation
new_df_gender = df.copy()
new_df_gender["Gender"] = new_df_gender["Gender"].apply(lambda x : 0 if x == 'Male' else 1)
print(new_df_gender.to_string())

# Correlate
print_spaces('# VI. CORRELATIONS - Salary / Gender')
print(new_df_gender['Salary'].corr(new_df_gender['Gender']))




# ______________________________________________________
# VI. ADVANCED: DATETIME FIX

# Keep
new_df = df.copy()

# Fix datetime
def fix_date_format(x):
	from datetime import datetime
	try:
		# split date, add 0 if only one digit, so date can be converted by datetime library
		x = '/'.join(list(map(lambda x: '0%s' %x if len(x)==1 else x, x.split('/'))))
		# convert to date and return
		return datetime.strptime(x, '%-m/%-d/%Y')
	except Exception:
		return x

df["Hired Year"] = df["Hired Year"].apply(lambda x : fix_date_format(x))

print_spaces('# VI. ADVANCED: DATETIME FIX')
print(df.to_string())




# ______________________________________________________
# VII. ADVANCED: SALARY DASHBOARD

# Keep
new_df = df.copy()

# _____________________________________
# 1. DROP
# src: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html

# Columns:
# > df.drop(['B', 'C'], axis=1)
# > df.drop(columns=['B', 'C'])

# Rows:
# - by numerical index
# > df.drop(index=[0, 1])

# - by string index
# > df.drop(index=('falcon', 'weight'))



# _____________________________________
# 1. ADD
# src: https://www.geeksforgeeks.org/adding-new-column-to-existing-dataframe-in-pandas/

# Columns:
# 	Assign a new column with a values list (must be the same number of values as there are rows in the DataFrame)
#	In this case, just using an .apply to convert salaries accordingly
df["Salary - Week"] = df["Salary"].apply(lambda x : x/4)
df["Salary - Year"] = df["Salary"].apply(lambda x : x*12)

print_spaces('# VII. ADVANCED: SALARY DASHBOARD')
print(df.to_string())




# ______________________________________________________
# VIII. PLOTTING

# Keep
new_df = df.copy

# _____________________________________
# 1. PLOT
import matplotlib.pyplot as plt
df.plot()

print_spaces('PRESS ENTER TO SHOW PLOT - THEN CLOSE PLOT TO CONTINUE TO NEXT…', msg=True)
input()
plt.show()


# _____________________________________
# 1. SCATTER PLOT
df.plot(kind = 'scatter', x = 'Salary', y = 'Age')

print_spaces('PRESS ENTER TO SHOW PLOT…', msg=True)
input()
plt.show()





print_spaces('------- END -------')
