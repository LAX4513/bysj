<template>
  <div class='post-page'>
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
      </div>
      <!-- 表单 -->
      <el-form ref="articleForm" :model="articleForm" :rules="articleRules" label-width="120px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <quill-editor @blur="checkContent()" v-model="articleForm.content" :options="editorOption"/>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-radio-group @change="articleForm.cover.images=[]" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 单图和三图才会使用my-cover组件 -->
          <div v-if="articleForm.cover.type===1||articleForm.cover.type===3">
            <my-cover
              @on-confirm="checkCover()"
              v-for="i in articleForm.cover.type"
              :key="i"
              v-model="articleForm.cover.images[i-1]">
            </my-cover>
          </div>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="" v-if="$route.query.id">
          <el-button type="success" @click="updateArtcile()">修改文章</el-button>
        </el-form-item>
        <el-form-item label="" v-else>
          <el-button type="primary" @click="addArticle(false)">发布文章</el-button>
          <el-button  @click="addArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'PostPage',
  components: { quillEditor },
  data () {
    // 自定义校验规则
    const checkCoverFn = (rule, value, cb) => {
      // 自己对value进行校验
      if (value.type === 1) {
        if (!value.images[0]) {
          return cb(new Error('请选择一张封面图'))
        }
      }
      if (value.type === 3) {
        if (!(value.images[0] && value.images[1] && value.images[2])) {
          return cb(new Error('请选择三张封面图'))
        }
      }
      // 代码走到这，校验成功
      cb()
    }
    return {
      // 校验规则
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 50, message: '文章标题3-50字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        cover: [
          { validator: checkCoverFn, trigger: 'change' }
        ]
      },
      // 表单数据
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置
      editorOption: {
        placeholder: '请输入文章内容',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  watch: {
    '$route.query.id': function () {
      if (this.$route.query.id) {
        // 修改文章，数据回填
        this.getArticle()
      } else {
        // 重置表单
        this.$refs.articleForm.resetFields()
      }
    }
  },
  created () {
    // 修改文章场景
    if (this.$route.query.id) {
      this.getArticle()
    }
  },
  methods: {
    // 获取文章详情
    async getArticle () {
      const { data: { data } } = await this.$http.get(`/mp/v1_0/articles/${this.$route.query.id}`)
      this.articleForm = data
    },
    checkContent () {
      // 校验内容表单项
      this.$refs.articleForm.validateField('content')
    },
    checkCover () {
      // 校验封面表单项
      this.$refs.articleForm.validateField('cover')
    },
    addArticle (draft) {
      // 整体表单校验
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          // 代表校验通过
          try {
            await this.$http.post(`/mp/v1_0/articles?draft=${draft}`, this.articleForm)
            // 成功：提示+跳转文章管理
            this.$message.success(draft ? '存入草稿成功' : '发布文章成功')
            this.$router.push('/articles')
          } catch (e) {
            this.$message.error(draft ? '存入草稿失败' : '发布文章失败')
          }
        }
      })
    },
    updateArtcile () {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          // 代表校验通过
          try {
            // 进行修改
            await this.$http.put(`/mp/v1_0/articles/${this.$route.query.id}`, this.articleForm)
            this.$message.success('修改文章成功')
            this.$router.push('/articles')
          } catch (e) {
            this.$message.success('修改文章失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
::v-deep .ql-toolbar.ql-snow {
  padding: 0 8px;
}
::v-deep .ql-editor {
  height: 200px;
}
</style>
