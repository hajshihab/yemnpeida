const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate, optionalAuth } = require('../middleware/auth');
const Article = require('../models/Article');

// AI Assistant - يمن بيديا المساعد الذكي
router.post('/ask', optionalAuth, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'السؤال مطلوب'
      });
    }

    // Search for relevant articles
    const relevantArticles = await Article.find({
      $text: { $search: question },
      status: 'published'
    })
      .select('title content summary')
      .limit(3);

    // Prepare context for AI
    let aiContext = `أنت "يمن بيديا"، مساعد ذكي متخصص في الموسوعة اليمنية. مهمتك مساعدة المستخدمين في:
1. البحث عن المعلومات في الموسوعة
2. تقديم معلومات دقيقة عن اليمن (التاريخ، الثقافة، الجغرافيا، إلخ)
3. مساعدة المحررين في كتابة وتحسين المقالات
4. الإجابة على الأسئلة بأسلوب موسوعي علمي

المقالات ذات الصلة من الموسوعة:
`;

    if (relevantArticles.length > 0) {
      relevantArticles.forEach((article, index) => {
        aiContext += `\n${index + 1}. ${article.title}\n${article.summary || article.content.substring(0, 200)}...\n`;
      });
    } else {
      aiContext += '\nلا توجد مقالات ذات صلة في الموسوعة حالياً.\n';
    }

    if (context) {
      aiContext += `\n\nسياق إضافي: ${context}\n`;
    }

    aiContext += `\n\nالسؤال: ${question}\n\nالرجاء تقديم إجابة مفيدة ودقيقة بالعربية:`;

    // Call AI API (OpenAI or Claude)
    let aiResponse;

    if (process.env.AI_API_PROVIDER === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت يمن بيديا، مساعد ذكي متخصص في الموسوعة اليمنية.'
            },
            {
              role: 'user',
              content: aiContext
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      aiResponse = response.data.choices[0].message.content;
    } else if (process.env.AI_API_PROVIDER === 'claude') {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: aiContext
            }
          ]
        },
        {
          headers: {
            'x-api-key': process.env.AI_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      aiResponse = response.data.content[0].text;
    } else {
      return res.status(500).json({
        success: false,
        message: 'مزود الذكاء الصناعي غير مُعرّف'
      });
    }

    res.json({
      success: true,
      answer: aiResponse,
      relatedArticles: relevantArticles.map(a => ({
        title: a.title,
        summary: a.summary
      }))
    });

  } catch (error) {
    console.error('AI Assistant error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في المساعد الذكي',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// AI-powered article suggestions
router.post('/suggest-improvements', authenticate, async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'المحتوى مطلوب'
      });
    }

    const prompt = `كمساعد للموسوعة اليمنية "يمن بيديا"، قم بمراجعة المقالة التالية واقترح تحسينات:

العنوان: ${title || 'بدون عنوان'}

المحتوى:
${content}

الرجاء تقديم:
1. تقييم عام للمقالة
2. اقتراحات للتحسين
3. معلومات إضافية يمكن إضافتها
4. ملاحظات حول الأسلوب والصياغة`;

    // Similar AI call as above
    let suggestions;

    if (process.env.AI_API_PROVIDER === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'أنت محرر خبير في يمن بيديا' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      suggestions = response.data.choices[0].message.content;
    } else if (process.env.AI_API_PROVIDER === 'claude') {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': process.env.AI_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      suggestions = response.data.content[0].text;
    }

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('AI Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على الاقتراحات'
    });
  }
});

module.exports = router;
