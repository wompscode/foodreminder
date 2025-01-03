# food-reminder
Created to remind a friend to eat.
  
### Usage
1. Copy config.default.json to config.json.
2. Create a webhook and copy the URL.
3. The first set of numbers after /api/webhooks is the ID, the set of alphanumeric characters after that is the token. Put them in the config.json.
4. Set the triggerHours. They are in 24-hours. 0 being 12AM, 23 being 11PM.
5. Set the reminderMessage. If you want to include the time, put `{{time}}` in the message.
6. Ensure isTesting is false, unless you want to test any changes. isTesting redirects from the main id/token to an alternative one, in case you don't want to bother the person.