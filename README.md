# nineramen
An exploration into the field of linguistics cleverly disguised as a JavaScript project.

More seriously, nineramen is a project designed to elevate the emojipasta experience.

## What is an emojipasta?

An emojipasta is an evolution of the copypasta, which according to [Wikipedia](https://en.wikipedia.org/wiki/Copypasta), is "a block of text which is copied and pasted across the internet by individuals through online forums." Generally speaking, across the board copypastas are made to ridicule/satirize the ridiculous people that one can find on the internet. This can be seen in the infamous "Navy Seal" copypasta, which is a "lengthy ... aggressive attack paragraph ... written in the voice of the stereotypical 'tough guy'".

To further highlight the ridiculousness of those who are being mocked with a copypasta, some have taken to include an emoji after nearly every word in the paragraph. Here is an emojipasta (courtesy of [Reddit](https://www.reddit.com/r/emojipasta/comments/hvbndl/harvard/)) presumably making fun of parents who overly embellish their children's accomplishments:

> Today 📅 my 12 😣🕛 year 📅 old 👴 son 👦 and I 👥 walked 🚶 into harvard 👩‍🎓 to sign 🚧 him 👴 up ☝ for college 🚌📚. The dean rudly asked ❓ what a 12 😣🕛 year 🗓 old 👴 was doing signing 🖊 up ⬆ for such a prestigious 🎖🏆 institute like 👍 harvard 👩‍🎓. My son 🙎‍♂️ took 👫 of to reveal 💡 his 🤦 Rick 👨🏻‍🔬 and Morty 😡😵 shirt 👕 and proclaimed "Well 🖕🖕🏻🖕🏿 you 👆 see 👁 sir 🤔 I 👁 watch 👁 Rick 🥒 and Morty 😡😵". A look 👀 of confusion ❓🤔 came 💦 over 😳🙊💦 the deans face 😀 and I 👁 have never 🚫 been so proud 😤. The dean quickly ⚡ made 👉 sure 💯 to appologize to my son 👦 but 👆🍑👀 it was too late 💤, the police 👮‍♂️ rushed 🏃‍♂️ in and dragged him 👨🏾 out. My son 👦 passed 📆 all 🙌 his 🤦 classes 📒 with 4.0s and graduated 🔝 top 🔝 of his 🤦 class 📒 in the first 🥇 day 📅 of college 🏘👱📚.

## How do you automate the process of converting a copypasta (or other plaintext) into emojipasta?

If you look at the emojipasta in the section above, you'll find that words of interest map to certain emojis. These word-emoji connections can be quite literal ("walked" maps to 🚶), but they can also be "abstract" as well (i.e., the 'average' person wouldn't be able to understand the connection). One example of this is the 🥒 emoji mapping to the word "Rick" - this is alluding to the infamous "Pickle Rick" meme from the popular show, Rick and Morty.

These word-emoji connections will be precisely what the nineramen app will rely on - ideally, in the future there will be a global database of word-emoji connections that can be added from any user with an account in the nineramen system.

## What about mean people?

The most memorable copypastas, in my opinion, are those that make fun of a certain type of people (e.g., gamers). In fact, I can't think of a copypasta off the top of my head that *doesn't* engage in some form of ridiculing. With this in mind, I don't think I could make an emojipasta-centered app that completely avoids the possibility of teasing.

That being said, there are obvious groups of people that should not be made fun of with a copypasta. To spell this out further, I mean that it is unacceptable to ridicule people of certain ethnicities, sexual orientations, etc. While I can't control what a user will type into the app, I'm working on a way for users to be able to report offensive word-emoji pairs so that admins can remove problematic ones.

## Development Timeline

When the app is finished, I plan on detailing more about the exact technology that the site will use. As of now, I'm using MongoDB, Node JS, and have plans to do the front end in either Vue or React.

- ~~Begin Express App~~
- ~~Build User Schemas~~
- ~~Finish Login/Signup endpoints~~
- ~~Build EmojiEntry Schemas~~
- ~~Lots of Refactoring~~
- ~~Testing Signup~~
- ~~Testing Login~~
- ~~Testing User Actions (e.g., adding emoji entries)~~
- ~~Testing Admin Actions (e.g., deleting emoji entries or users)~~
- Implementing Rate Limiting
- Documentation
- ~~Begin Front End~~