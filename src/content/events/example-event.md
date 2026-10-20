---
title: "PLACEHOLDER: replace with a real event"
summary: "An example event entry showing how the events calendar works. Replace this file with a real event, or delete it."
startDate: 2026-11-12
endDate: 2026-11-13
time: "09:00 – 16:00 WAT"
category: "Workshop"
format: "In person"
role: "Hosting"
venue: "Venue name"
location: "Abuja, Nigeria"
registration:
  label: "Register to attend"
  href: "https://example.com/register"
tags: ["GIS", "Remote sensing"]
draft: true
---

This file is a template, not a real event. It has `draft: true` in its front
matter, so it appears while you run the site locally and is left out of the
published build.

## How to use it

1. Copy this file and give it a new name: the filename becomes the web address,
   so `geospatial-workshop-abuja.md` becomes `/events/geospatial-workshop-abuja/`.
2. Fill in the front matter above. `startDate` is the first day of the event;
   add `endDate` for an event that runs over several days. `time`, `venue`,
   `role`, `registration` and `tags` are optional, so delete any you do not need.
3. Remove the `draft: true` line when the event is ready to publish.
4. Write the agenda, speakers and practical details here in Markdown.

The soonest upcoming event is featured at the top of `/events` with a live
countdown. Once an event's last day has passed it moves to the past events
archive and its registration button is hidden. That move happens when the site
is rebuilt, so a periodic rebuild keeps the calendar tidy.
