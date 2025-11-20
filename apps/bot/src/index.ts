import { Bot, InlineKeyboard } from 'grammy';
import QRCode from 'qrcode';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL;
const API_URL = process.env.API_URL || 'http://localhost:4000';

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

const bot = new Bot(BOT_TOKEN);

bot.command('start', async (ctx) => {
  const userName = ctx.from?.first_name || 'お客様';
  const keyboard = new InlineKeyboard()
    .webApp('📱 注文を始める', MINI_APP_URL || 'https://example.com')
    .row()
    .text('ℹ️ 使い方', 'help');

  await ctx.reply(
    `🍽️ ようこそ、___BEGIN___COMMAND_DONE_MARKER___$LASTEXITCODE{userName}さん！\n\nテーブルのQRコードをスキャンして、\n簡単にモバイルオーダーが始められます。`,
    { reply_markup: keyboard }
  );
});

bot.callbackQuery('help', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('📖 使い方ガイド\n\n1️⃣ テーブルのQRコードをスキャン\n2️⃣ 来店人数を入力\n3️⃣ メニューから注文');
});

bot.catch((err) => {
  console.error('Bot error:', err);
});

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Bot started: @___BEGIN___COMMAND_DONE_MARKER___$LASTEXITCODE{botInfo.username}`);
  }
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
